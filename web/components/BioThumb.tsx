"use client";

import Image from "next/image";
import { useState } from "react";

const BIO_SRC = "/74266592_10157066813674888_1141337702931628032_n.jpg";

export default function BioThumb() {
  const [failed, setFailed] = useState(false);

  return (
    <div className="bio-thumb">
      {!failed ? (
        <Image
          src={BIO_SRC}
          alt="Ladislav Jurić — The Architect"
          width={256}
          height={256}
          sizes="96px"
          className="bio-thumb-img"
          onError={() => setFailed(true)}
        />
      ) : null}
      {failed ? <div className="bio-thumb-placeholder">LJ</div> : null}
    </div>
  );
}
