
import { hydrateRoot } from "react-dom/client";
import { RemixBrowser } from "@remix-run/react";
import React from "react";

hydrateRoot(document.getElementById("root")!, <RemixBrowser />);

