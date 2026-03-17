"use client";

import { useState } from "react";

export default function BioThumb() {
  const [failed, setFailed] = useState(false);

  return (
    <div className="bio-thumb">
      {!failed ? (
        <img
          src="/assets/placeholder-ladislav.jpg"
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
