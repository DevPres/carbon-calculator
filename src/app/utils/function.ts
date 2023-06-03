import { DestroyRef, inject } from "@angular/core";
import { Subject, takeUntil } from "rxjs";


export function untildestroyed() {
  const subject = new Subject();

  inject(DestroyRef).onDestroy(() => {
    subject.next(true);
    subject.complete();
  });

  return () => takeUntil(subject.asObservable());
}


export function generateUUID() {
  return Math.floor(Math.random() * Date.now()).toString(16)
}
