import Image from "next/image";

interface Props {
  overline?: string;
  title: string[];
  image?: string;
}

export default function PageHero({ overline, title, image }: Props) {
  return (
    <section
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        minHeight: "500px",
        maxHeight: "900px",
        background: "var(--color-bg)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        padding: "60px 40px 60px",
      }}
    >
      {/* Background image */}
      {image && (
        <>
          <Image
            src={image}
            alt={title.join(" ")}
            fill
            priority
            style={{ objectFit: "cover", objectPosition: "center" }}
            sizes="100vw"
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.6) 100%)",
              zIndex: 1,
            }}
          />
        </>
      )}

      {/* Content */}
      <div style={{ position: "relative", zIndex: 2 }}>
        {overline && (
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "12px",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "var(--color-text-dim)",
              marginBottom: "20px",
            }}
          >
            {overline}
          </p>
        )}
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(66px, 13vw, 157px)",
            fontWeight: 400,
            lineHeight: 0.85,
            letterSpacing: "-0.06em",
            color: "var(--color-text-primary)",
          }}
        >
          {title.map((line, i) => (
            <span key={i} style={{ display: "block" }}>
              {line}
            </span>
          ))}
        </h1>
      </div>
    </section>
  );
}
