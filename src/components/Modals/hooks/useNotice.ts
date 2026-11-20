"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  CONTRACTS_PAUSED,
  CONTRACTS_PAUSED_EVENT,
  NOTICE_STORAGE_KEY,
} from "@/constants";

export const useNotice = () => {
  const [noticeOpen, setNoticeOpen] = useState<boolean>(false);
  const blockedAt = useRef<number>(0);

  useEffect(() => {
    if (!CONTRACTS_PAUSED) return;

    let seen = false;
    try {
      seen = window.sessionStorage.getItem(NOTICE_STORAGE_KEY) === "1";
    } catch (err) {
      seen = false;
    }
    if (!seen) setNoticeOpen(true);

    const onBlocked = () => {
      blockedAt.current = Date.now();
      setNoticeOpen(true);
    };

    window.addEventListener(CONTRACTS_PAUSED_EVENT, onBlocked);
    return () => {
      window.removeEventListener(CONTRACTS_PAUSED_EVENT, onBlocked);
    };
  }, []);

  const hideNotice = useCallback(() => {
    try {
      window.sessionStorage.setItem(NOTICE_STORAGE_KEY, "1");
    } catch (err) {}
    setNoticeOpen(false);
  }, []);

  const wasJustBlocked = useCallback((message: string): boolean => {
    return (
      message === CONTRACTS_PAUSED_EVENT ||
      Date.now() - blockedAt.current < 2000
    );
  }, []);

  return { noticeOpen, hideNotice, wasJustBlocked };
};
