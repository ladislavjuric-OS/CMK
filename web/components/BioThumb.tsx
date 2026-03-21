"use client";

import { useState } from "react";

export default function BioThumb() {
  const [failed, setFailed] = useState(false);

  return (
    <div className="bio-thumb">
      {!failed ? (
        <img
          src="/74266592_10157066813674888_1141337702931628032_n.jpg"
          alt="Ladislav Jurić — The Architect"
          onError={() => setFailed(true)}
        />
      ) : null}
      {failed ? (
        <div className="bio-thumb-placeholder">LJ</div>
      ) : null}
    </div>
  );
}
