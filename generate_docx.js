const fs = require("fs");
const path = require("path");
const docx = require("docx");
const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  BorderStyle,
  WidthType,
  AlignmentType,
  HeadingLevel
} = docx;

const mdPath = path.join(__dirname, "paymaster_project_report.md");
const docxPath = path.join(__dirname, "paymaster_project_report.docx");

if (!fs.existsSync(mdPath)) {
  console.error("❌ Error: paymaster_project_report.md not found!");
  process.exit(1);
}

const mdContent = fs.readFileSync(mdPath, "utf-8");
const lines = mdContent.split(/\r?\n/);

const docElements = [];
let currentTableRows = [];
let isInTable = false;

// Helpers to clean markdown inline styles (like bold **text** or italics)
function parseInlineStyles(text) {
  const runs = [];
  let remaining = text.trim();

  // Simple regex parser for bold **text**
  const boldRegex = /\*\*(.*?)\*\*/g;
  let match;
  let lastIdx = 0;

  // Temporary container for matches
  const matches = [];
  while ((match = boldRegex.exec(remaining)) !== null) {
    matches.push({
      start: match.index,
      end: boldRegex.lastIndex,
      text: match[1]
    });
  }

  if (matches.length === 0) {
    runs.push(new TextRun({ text: text, font: "Calibri", size: 22 })); // 11pt
  } else {
    for (let i = 0; i < matches.length; i++) {
      const m = matches[i];
      if (m.start > lastIdx) {
        runs.push(new TextRun({
          text: remaining.substring(lastIdx, m.start),
          font: "Calibri",
          size: 22
        }));
      }
      runs.push(new TextRun({
        text: m.text,
        bold: true,
        font: "Calibri",
        size: 22
      }));
      lastIdx = m.end;
    }
    if (lastIdx < remaining.length) {
      runs.push(new TextRun({
        text: remaining.substring(lastIdx),
        font: "Calibri",
        size: 22
      }));
    }
  }

  return runs;
}

function addTable() {
  if (currentTableRows.length > 0) {
    const tableRows = currentTableRows.map((rowCells, rowIndex) => {
      return new TableRow({
        children: rowCells.map((cellText, cellIndex) => {
          const isHeader = rowIndex === 0;
          return new TableCell({
            children: [
              new Paragraph({
                children: parseInlineStyles(cellText),
                alignment: cellIndex === 0 || cellIndex === 2 ? AlignmentType.CENTER : AlignmentType.LEFT
              })
            ],
            shading: isHeader ? { fill: "1b2640" } : undefined,
            width: {
              size: cellIndex === 0 ? 1500 : cellIndex === 1 ? 5500 : 2000,
              type: WidthType.DXA
            },
            margins: {
              top: 120,
              bottom: 120,
              left: 150,
              right: 150
            }
          });
        })
      });
    });

    const table = new Table({
      rows: tableRows,
      width: {
        size: 9000,
        type: WidthType.DXA
      },
      alignment: AlignmentType.CENTER
    });

    docElements.push(table);
    docElements.push(new Paragraph({ text: "" })); // spacing
    currentTableRows = [];
  }
}

for (let i = 0; i < lines.length; i++) {
  const line = lines[i].trim();

  // Handle Tables
  if (line.startsWith("|")) {
    // Skip separator rows like | :--- | :--- |
    if (line.includes("---")) {
      continue;
    }
    isInTable = true;
    const parts = line.split("|").map(p => p.trim()).filter((p, idx, arr) => idx > 0 && idx < arr.length - 1);
    currentTableRows.push(parts);
    continue;
  } else if (isInTable) {
    addTable();
    isInTable = false;
  }

  // Blank lines
  if (!line) {
    // Add small spacer paragraph if not multiple consecutive blank lines
    if (i > 0 && lines[i - 1].trim()) {
      docElements.push(new Paragraph({ text: "" }));
    }
    continue;
  }

  // Heading Level 1 (Title)
  if (line.startsWith("# ")) {
    docElements.push(
      new Paragraph({
        heading: HeadingLevel.TITLE,
        children: [
          new TextRun({
            text: line.substring(2),
            bold: true,
            size: 48, // 24pt
            font: "Calibri",
            color: "6366f1"
          })
        ],
        spacing: { before: 240, after: 120 }
      })
    );
    continue;
  }

  // Heading Level 2 (Section headings)
  if (line.startsWith("## ")) {
    docElements.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [
          new TextRun({
            text: line.substring(3),
            bold: true,
            size: 36, // 18pt
            font: "Calibri",
            color: "a855f7"
          })
        ],
        spacing: { before: 360, after: 120 }
      })
    );
    continue;
  }

  // Heading Level 3 (Sub-sections)
  if (line.startsWith("### ")) {
    docElements.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [
          new TextRun({
            text: line.substring(4),
            bold: true,
            size: 28, // 14pt
            font: "Calibri",
            color: "1b2640"
          })
        ],
        spacing: { before: 240, after: 120 }
      })
    );
    continue;
  }

  // Page Break or Horizontal Rule
  if (line === "---") {
    // Add horizontal line or separator
    docElements.push(
      new Paragraph({
        border: {
          bottom: {
            color: "cccccc",
            space: 1,
            style: BorderStyle.SINGLE,
            size: 6
          }
        },
        spacing: { before: 200, after: 200 }
      })
    );
    continue;
  }

  // Bullet Point Lists
  if (line.startsWith("* ") || line.startsWith("- ")) {
    const listText = line.substring(2);
    docElements.push(
      new Paragraph({
        bullet: { level: 0 },
        children: parseInlineStyles(listText),
        spacing: { before: 60, after: 60 }
      })
    );
    continue;
  }

  // Numbered Lists (like 1. **Remove Local Server...**)
  const numListMatch = line.match(/^(\d+)\.\s(.*)/);
  if (numListMatch) {
    const listText = numListMatch[2];
    docElements.push(
      new Paragraph({
        children: [
          new TextRun({ text: `${numListMatch[1]}. `, bold: true, font: "Calibri", size: 22 }),
          ...parseInlineStyles(listText)
        ],
        spacing: { before: 60, after: 60 },
        indent: { left: 360 }
      })
    );
    continue;
  }

  // Regular Paragraphs
  docElements.push(
    new Paragraph({
      children: parseInlineStyles(line),
      spacing: { before: 120, after: 120 }
    })
  );
}

// In case the file ended with a table
if (isInTable) {
  addTable();
}

// Build document
const doc = new Document({
  sections: [
    {
      properties: {},
      children: docElements
    }
  ]
});

// Pack & Write
Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync(docxPath, buffer);
  console.log(`✅ Word document generated successfully at: ${docxPath}`);
}).catch((err) => {
  console.error("❌ Error packing document:", err.message);
  process.exit(1);
});
