"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

let registered = false;

export function registerGsap() {
  if (registered || typeof window === "undefined") return;
  gsap.registerPlugin(ScrollTrigger, useGSAP);
  gsap.defaults({ ease: "expo.out" });
  registered = true;
}

registerGsap();

export { gsap, ScrollTrigger, useGSAP };
