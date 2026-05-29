export default function BrandLogo({ compact = false }) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

  return (
    <span
      className={`flex items-center rounded-lg bg-white ${
        compact ? "h-16 w-32" : "h-14 w-36 sm:h-16 sm:w-40"
      }`}
    >
      <img
        src={`${basePath}/smar-reality-logo.png`}
        alt="SMAR Reality"
        className="h-full w-full object-contain"
      />
    </span>
  );
}
