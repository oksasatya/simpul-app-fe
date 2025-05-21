"use client";

import { ReactNode } from "react";
import {store} from "@/store";
import {Provider} from "react-redux";
import React from "react";

export default function ClientProviders({ children }: { children: ReactNode }) {
    return <Provider store={store}>{children}</Provider>;
}
