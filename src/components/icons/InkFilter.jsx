// Filtro SVG do "estilo desenho": contorno escuro em volta da silhueta e uma sombra sólida
// deslocada (o mesmo traço do .toon-btn). Vai dentro de <defs>; aplique com filter="url(#id)"
// nos grupos que devem ganhar contorno. Funciona em SVG puro, onde o filter do CSS não chega.
export default function InkFilter({ id, width = 2.5, offset = 5, color = '#1e1b3a' }) {
  return (
    <filter id={id} x="-15%" y="-15%" width="140%" height="140%" colorInterpolationFilters="sRGB">
      <feMorphology in="SourceAlpha" operator="dilate" radius={width} result="grow" />
      <feFlood floodColor={color} result="ink" />
      <feComposite in="ink" in2="grow" operator="in" result="outline" />
      <feOffset in="outline" dx={offset} dy={offset} result="pop" />
      <feMerge>
        <feMergeNode in="pop" />
        <feMergeNode in="outline" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  )
}
