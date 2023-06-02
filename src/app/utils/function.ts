import { DestroyRef, inject } from "@angular/core";
import { Subject, takeUntil } from "rxjs";

// utils/functions.ts
export function untildestroyed() {
  const subject = new Subject();

  inject(DestroyRef).onDestroy(() => {
    subject.next(true);
    subject.complete();
  });

  return () => takeUntil(subject.asObservable());
}
