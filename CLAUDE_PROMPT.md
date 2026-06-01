# 🤖 Prompt para Claude — Handbook Interactivo AED UT03

Copiá este prompt completo al inicio de tu sesión con Claude.  
Luego adjuntá el ZIP del proyecto y el material de clase que quieras agregar.

---

## PROMPT BASE (copiá todo esto)

```
Soy estudiante de AED (Algoritmos y Estructuras de Datos) y estoy colaborando
en un handbook interactivo compartido entre compañeros de clase.
El proyecto está en el repositorio [URL del repo].

## El proyecto

Es una aplicación React 18 + Vite 5. Tiene 29 páginas organizadas en 5 capítulos:
- Árboles Genéricos (páginas 0–4)
- Tries (páginas 5–9)
- Hashing & Diccionarios (páginas 10–14)
- Java Collections API (páginas 15–19)
- Extra + Resumen (páginas 20–28)

Cada capítulo tiene su archivo en src/pages/. Las visualizaciones interactivas
están en src/components/. No se usan librerías de UI externas — todo es SVG puro
y estilos inline.

## Design system

Colores (definidos en src/constants.js):
  AC = '#e84055'  → rojo acento (código, highlights, página número)
  BL = '#3a72b8'  → azul (labels, interfaces)
  BG = '#e8e8e3'  → fondo de página
  CH = '#f1dfc2'  → fondo de portadas/splash
  TX = '#111'     → texto principal
  BD = '#1e1e1e'  → bordes

Tipografías (Google Fonts, cargadas en index.html):
  'Playfair Display' 900  → títulos de capítulo (h1)
  'Lora'                  → cuerpo de texto
  'JetBrains Mono'        → código, badges, pseudocódigos

## Componentes disponibles para usar en páginas

Layouts (src/components/PageShells.jsx):
  <TwoCol title badge num left right>   → dos columnas: texto izq, visual der
  <FullPg title badge num content>      → página completa centrada
  <Splash number title visual>          → portada de capítulo (fondo beige)

Visualizaciones interactivas:
  <TreeViz tree onUpdate>               → árbol genérico SVG interactivo
  <TraversalViz tree>                   → animación preorden / postorden
  <TrieViz>                             → trie con búsqueda animada
  <TriePrefixViz>                       → búsqueda por prefijo interactiva
  <HashViz>                             → tabla hash con encadenamiento (PUT)
  <OpenAddressingViz>                   → sondeo lineal y cuadrático animado
  <CollHierarchy>                       → jerarquía Collections (SVG)

Texto y contenido:
  <CodeBlock label lines steps>         → código con slider y animación step-by-step
  <CompTable headers rows>              → tabla de complejidades
  S(texto)                              → <strong>texto</strong>
  C(codigo)                             → <code> monospace rojo inline
  <P>párrafo</P>                        → párrafo con márgenes
  <UL items={[...]}>                    → lista (acepta JSX en cada item)

## Cómo se estructura una página

Las páginas son funciones que devuelven JSX dentro del array de pages():

// Página de dos columnas (la más usada):
() => <TwoCol title="Árbol Genérico" badge="DEFINICION" num={1}
  left={<div>
    <P>Texto del concepto.</P>
    <pre style={{fontFamily:"'JetBrains Mono',monospace", fontSize:11,
      color:"#e84055", lineHeight:1.9, background:"#f9f8f4",
      padding:"8px 10px", border:"1px solid #ddd"}}>
      {`Algoritmo preOrden(v):\n  visitar(v)\n  Para cada hijo w de v\n    preOrden(w)`}
    </pre>
  </div>}
  right={<CodeBlock label="Implementación" lines={["public void ...", "  ..."]} steps={[[0],[1]]}/>}
/>,

Para pseudocódigos del material de clase usar siempre <pre> con template literals
(NO usar <br/> — causa errores de compilación).

## Reglas de contenido (IMPORTANTES)

1. TODO el contenido debe estar verificado contra el material de clase adjunto
2. Los pseudocódigos deben ser EXACTAMENTE los del material — no los de internet
3. Si algo no está en las fuentes, marcarlo como parcial o no incluirlo
4. Usar NotebookLM con las fuentes de la materia para verificar
5. No agregar información de BST, grafos u otros temas que no estén en UT03

## Lo que necesito que hagas

[DESCRIBÍ AQUÍ QUÉ QUERÉS AGREGAR — ejemplos:]

Ejemplo A: "Quiero agregar 2 páginas nuevas sobre [TEMA] al capítulo de [CAPÍTULO].
Adjunto las slides del tema. Incluí los pseudocódigos exactos de las slides."

Ejemplo B: "Quiero crear un nuevo componente interactivo que muestre [COMPORTAMIENTO].
Seguí el mismo estilo visual que los componentes existentes."

Ejemplo C: "Quiero mejorar la página [NÚMERO] del capítulo [NOMBRE].
Acá está el material de clase que dice cómo debería quedar: [TEXTO]"

Ejemplo D: "Quiero agregar un capítulo nuevo sobre [TEMA].
Adjunto el material. Creá las páginas: splash, definición, terminología,
operaciones con pseudocódigo, e implementación Java."

## Archivos que te adjunto

- El ZIP del proyecto actual (handbook-vite.zip)
- [El material de clase: PDF / PPTX / apuntes que querés incorporar]

Por favor:
1. Leé el ZIP para entender la estructura actual
2. Leé el material adjunto
3. Generá los archivos modificados/nuevos
4. Dame el ZIP actualizado para reemplazar en el repositorio
5. Decime exactamente qué cambió y por qué
```

---

## Tips para mejores resultados

**Para agregar páginas con pseudocódigo:**
> "Las slides dicen exactamente esto: [PEGÁ EL TEXTO]. Agregalo como pseudocódigo
> en la página [N] usando el formato `<pre>` con template literals."

**Para verificar contenido:**
> "¿Esta afirmación está respaldada por el material que te adjunté?
> Si no, decime qué hay que cambiar."

**Para crear visualizaciones nuevas:**
> "Quiero una visualización interactiva que muestre [COMPORTAMIENTO].
> El usuario debería poder [ACCIÓN]. Seguí el mismo estilo que HashViz o TrieViz."

**Para corregir errores:**
> "Hay un error en [ARCHIVO / PÁGINA]: [DESCRIPCIÓN DEL ERROR].
> El material de clase dice que debería ser: [TEXTO CORRECTO]."

---

## Convenciones del proyecto

- Pseudocódigos: siempre `<pre style={{...}}>{\`...\n...\`}</pre>` — NUNCA `<br/>`
- Importar constantes: `import { AC, BL, BG, TX, BD } from '../constants'`
- Importar helpers: `import { S, C, P, UL } from '../helpers'`
- Importar componentes: `import CodeBlock from '../components/CodeBlock'`
- Cada página es una función arrow `() => <TwoCol .../>`
- Al agregar páginas: actualizar `TOTAL` en `src/constants.js`

