# 📖 Handbook Interactivo — AED UT03

Handbook interactivo colaborativo para la unidad temática 03 de Algoritmos y Estructuras de Datos.  
Construido con **Vite + React 18**, visualizaciones en SVG puro, sin librerías de UI externas.

## Temas cubiertos

| Capítulo | Contenido |
|---|---|
| 🌳 Árboles Genéricos | Definición, terminología, representación Java, recorridos (pre/in/post orden), height, size, BFS, primer hijo/hermano derecho |
| 🔤 Tries | Trie estándar, búsqueda (palabra completa y prefijo), inserción, eliminación, Patricia, representación con Map |
| #️⃣ Hashing | Mapas vs Diccionarios, esquema de división, encadenamiento separado, encadenamiento abierto (lineal/cuadrático/doble), hashCode/equals |
| ☕ Java Collections | Jerarquía, Collection, List, listIterator, subList, algoritmos, Map, vistas, Comparable/Comparator, Queue/Stack, criterios de elección |
| 📋 Extra + Resumen | Operaciones avanzadas, complejidades, cheatsheet, Patricia Trie, Queue/Stack, criterios |

---

## ⚡ Instalación y ejecución

### Requisitos
- Node.js 18 o superior
- npm 9 o superior

### Pasos

```bash
# 1. Clonar el repositorio
git clone <URL-DEL-REPO>
cd handbook-vite

# 2. Instalar dependencias
npm install

# 3. Iniciar servidor de desarrollo
npm run dev
```

Abrí http://localhost:5173 en el navegador.

### Otros comandos

```bash
npm run build    # Compilar para producción
npm run preview  # Previsualizar build de producción
```

---

## 🗂️ Estructura del proyecto

```
src/
├── constants.js          ← Colores, CHAPTERS, TOTAL (páginas)
├── treeUtils.js          ← Algoritmos de layout de árboles
├── data.js               ← Datos iniciales (árbol, trie, hash table)
├── helpers.jsx           ← Helpers JSX: S(), C(), P(), UL()
├── App.jsx               ← Navegación principal
├── components/
│   ├── CodeBlock.jsx     ← Bloque de código con animación step-by-step
│   ├── TreeViz.jsx       ← Árbol genérico interactivo (SVG)
│   ├── TraversalViz.jsx  ← Animación de recorridos
│   ├── TrieViz.jsx       ← Trie con búsqueda animada
│   ├── TriePrefixViz.jsx ← Búsqueda por prefijo en trie
│   ├── HashViz.jsx       ← Tabla hash con encadenamiento
│   ├── OpenAddressingViz.jsx ← Encadenamiento abierto step-by-step
│   ├── CollHierarchy.jsx ← Jerarquía de Collections (SVG)
│   ├── CompTable.jsx     ← Tabla de complejidades
│   ├── TermDiagrams.jsx  ← Diagramas de terminología
│   ├── SplashVisuals.jsx ← Ilustraciones de portada
│   └── PageShells.jsx    ← Layouts: Splash, TwoCol, FullPg
└── pages/
    ├── GenericTrees.jsx  ← Páginas 0–4
    ├── Tries.jsx         ← Páginas 5–9
    ├── Hashing.jsx       ← Páginas 10–14
    ├── Collections.jsx   ← Páginas 15–19
    └── Extra.jsx         ← Páginas 20–28
```

---

## ➕ Cómo agregar páginas nuevas

### 1. Elegir el archivo de páginas correcto

Cada capítulo tiene su archivo en `src/pages/`. Abrí el que corresponde al tema y agregá una nueva función al array que devuelve `pages()`.

### 2. Estructura básica de una página

```jsx
// Página de dos columnas (la más común)
() => <TwoCol
  title="Nombre del Capítulo"
  badge="SUBTEMA"
  num={XX}          // número de página
  left={<div>
    {/* Texto, listas, pseudocódigos */}
    <P>Explicación del concepto.</P>
    <pre style={{fontFamily:"'JetBrains Mono',monospace", fontSize:11,
      color:"#e84055", lineHeight:1.9, background:"#f9f8f4",
      padding:"8px 10px", border:"1px solid #ddd"}}>
      {`Algoritmo ejemplo(v):\n  paso 1\n  paso 2`}
    </pre>
  </div>}
  right={
    <CodeBlock
      label="Nombre del ejemplo"
      lines={["línea 1", "línea 2", "línea 3"]}
      steps={[[0], [1], [2]]}
    />
  }
/>,

// Página completa (para diagramas de terminología)
() => <FullPg
  title="Nombre"
  badge="TERMINOLOGIA"
  num={XX}
  content={<MiDiagrama/>}
/>,
```

### 3. Actualizar el total de páginas

En `src/constants.js`, incrementá `TOTAL`:

```js
export const TOTAL = 29; // → cambiá a 30 si agregás 1 página
```

Si el capítulo empieza en una página diferente, actualizá también `CHAPTERS`:

```js
export const CHAPTERS = [
  { id: 'trees',   label: 'Árboles Genéricos', start: 0  },
  { id: 'tries',   label: 'Tries',             start: 5  },
  // ... etc
];
```

### 4. Componentes disponibles

| Componente | Uso |
|---|---|
| `<TwoCol>` | Layout dos columnas: texto izq, visual/código der |
| `<FullPg>` | Página completa, contenido centrado |
| `<Splash>` | Portada de capítulo (fondo beige) |
| `<CodeBlock lines steps>` | Código con slider y animación step-by-step |
| `<CompTable headers rows>` | Tabla de complejidades estilizada |
| `<TreeViz>` | Árbol genérico interactivo (clic +1, clic derecho -1) |
| `<TraversalViz>` | Animación preorden / postorden |
| `<TrieViz>` | Trie con búsqueda animada |
| `<TriePrefixViz>` | Búsqueda de prefijo en trie |
| `<HashViz>` | Tabla hash con encadenamiento (PUT interactivo) |
| `<OpenAddressingViz>` | Encadenamiento abierto: lineal y cuadrático |
| `<CollHierarchy>` | Jerarquía de Java Collections (SVG) |
| `S(texto)` | Texto en negrita |
| `C(codigo)` | Texto monospace rojo (inline code) |
| `P` | Párrafo con margen |
| `UL items={[...]}` | Lista con items (acepta JSX) |

---

## 🎨 Design system

```js
AC = '#e84055'   // rojo acento (títulos de sección, código, highlights)
BL = '#3a72b8'   // azul (labels, interfaces, anotaciones)
BG = '#e8e8e3'   // fondo de página
CH = '#f1dfc2'   // fondo de splash / portadas
TX = '#111'      // texto principal
BD = '#1e1e1e'   // bordes y líneas
```

**Tipografías** (cargadas desde Google Fonts en `index.html`):
- `'Playfair Display' 900` → título de capítulo (`<h1>`)
- `'Lora'` → cuerpo de texto y listas
- `'JetBrains Mono'` → código, badges, pseudocódigos

---

## ✅ Reglas de contenido

1. **Todo debe estar verificado** contra el material de clase (slides PPTX y PDFs de la UT03)
2. **Los pseudocódigos deben ser exactamente** los del material — no los de Wikipedia o Stack Overflow
3. Si algo no está en las fuentes, **marcarlo como parcial** o no incluirlo
4. **Usar NotebookLM** con las fuentes de la materia para verificar antes de hacer PR

---

## 🤖 Prompt para usar con Claude

Ver archivo [`CLAUDE_PROMPT.md`](./CLAUDE_PROMPT.md) para el prompt completo.

---

## 🤝 Contribuir

1. Forkeá el repo
2. Creá una rama: `git checkout -b feature/mi-tema`
3. Usá el prompt de Claude para agregar contenido
4. Verificá contra el material de clase
5. Hacé Pull Request con descripción de qué páginas agregaste y qué fuentes usaste

---

*Proyecto colaborativo — AED UT03 · Facultad de Ingeniería*
