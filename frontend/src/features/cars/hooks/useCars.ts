import { useCallback, useEffect, useState } from "react";
import { toApiError } from "@/lib/apiError";
import { getCar, getCars } from "../api/carsApi";

type LoadState<T> =
  | { status: "loading" }
  | { status: "error"; message: string; httpStatus: number | null }
  | { status: "success"; data: T };

/** `load` must be stable (a module function or wrapped in useCallback), or it refetches every render. */
function useLoad<T>(load: () => Promise<T>, reloadKey = 0) {
  const [state, setState] = useState<LoadState<T>>({ status: "loading" });

  useEffect(() => {
    let isCancelled = false;

    load().then(
      (data) => {
        if (!isCancelled) setState({ status: "success", data });
      },
      (err) => {
        const { message, status } = toApiError(err);
        if (!isCancelled) setState({ status: "error", message, httpStatus: status });
      },
    );

    return () => {
      isCancelled = true;
    };
  }, [load, reloadKey]);

  return [state, setState] as const;
}

export function useCars() {
  const [reloadCount, setReloadCount] = useState(0);
  const [state, setState] = useLoad(getCars, reloadCount);

  const reload = useCallback(() => {
    setState({ status: "loading" });
    setReloadCount((count) => count + 1);
  }, [setState]);

  const removeFromList = useCallback(
    (id: number) => {
      setState((current) =>
        current.status === "success"
          ? { status: "success", data: current.data.filter((car) => car.id !== id) }
          : current,
      );
    },
    [setState],
  );

  return { state, reload, removeFromList };
}

/** Render the caller with `key={id}` so switching cars starts from a fresh loading state. */
export function useCar(id: number) {
  const load = useCallback(() => getCar(id), [id]);
  const [state] = useLoad(load);
  return state;
}
