"use client";

import * as React from "react";

const subscribe = () => () => {};

/**
 * False on the server and during hydration, true afterwards.
 *
 * Content below a Suspense boundary hydrates in a later task, by which time a shared query such as
 * the session may already have resolved. Branching straight on that data makes the first client
 * render disagree with the server HTML, so session-dependent UI waits for this flag instead.
 */
export function useHydrated(): boolean {
  return React.useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
