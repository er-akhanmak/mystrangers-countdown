/**
 * Logo: mystrangers GIF (teal-to-blue gradient on black).
 * Fluid mode: set fluid=true and size is ignored; image scales with container.
 */
import logoGif from '../assets/mystrangers-logo-pic.GIF';

export default function MystrangersLogo({ size = 48, fluid = false }: { size?: number; fluid?: boolean }) {
  const height = size;
  const width = fluid ? undefined : height * (240 / 32); // approximate aspect for fixed size

  return (
    <img
      src={logoGif}
      alt="mystrangers"
      width={fluid ? undefined : width}
      height={fluid ? undefined : height}
      style={{
        display: 'block',
        ...(fluid ? { width: '100%', height: 'auto', maxWidth: '100%' } : {}),
      }}
      loading="eager"
      decoding="async"
    />
  );
}
