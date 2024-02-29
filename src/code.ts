import { icons as fa5 } from './icons_fa5'
import { icons as fa6 } from './icons_fa6'

interface RenamableNode {
  nodeId: string
  newName: string
}

interface Result {
  focusNodes: SceneNode[]
  renamableNodes: RenamableNode[]
}

function findDescendantsTextNodes(node: SceneNode): TextNode[] {
  if (node.type === 'TEXT') {
    return [node]
  } else if ('children' in node) {
    var textNodes: TextNode[] = []
    for (const child of node.children) {
      textNodes = textNodes.concat(findDescendantsTextNodes(child))
    }
    return textNodes
  }
  return []
}

function findAllTextNodesInSelection(): TextNode[] {
  var textNodes: TextNode[] = []
  for (const node of figma.currentPage.selection) {
    textNodes = textNodes.concat(findDescendantsTextNodes(node))
  }
  return textNodes
}

async function findAllTextNodesInCurrentPage(): Promise<TextNode[]> {
  await figma.currentPage.loadAsync()
  return figma.currentPage.findAll((node) => node.type === 'TEXT') as TextNode[]
}

async function filterRenamableTextNodes(textNodes: TextNode[]): Promise<Result> {
  const result: Result = { focusNodes: [], renamableNodes: [] }

  for (const textNode of textNodes) {
    if (textNode.characters.length !== 1) continue

    const font = textNode.getRangeFontName(0, 1) as FontName
    const fontFamilySegments = font.family.split(" ")
    if (fontFamilySegments.length < 2) continue
    if (!(fontFamilySegments[0] === 'Font' && fontFamilySegments[1] === 'Awesome')) continue

    var fontAwesomeVersion = '?'
    if (fontFamilySegments.length > 2) {
      fontAwesomeVersion = fontFamilySegments[2]
    }

    const unicode = textNode.characters.charCodeAt(0).toString(16)

    var iconName = '?'
    switch (fontAwesomeVersion) {
      case '5':
        iconName = fa5.get(unicode) ?? iconName
        break

      case '6':
      default:
        iconName = fa6.get(unicode) ?? iconName
        break
    }
    const newName = `[FA${fontAwesomeVersion}-${font.style}] ${iconName} / ${unicode}`
    if (textNode.name === newName) continue

    result.focusNodes.push(textNode)
    result.renamableNodes.push({ nodeId: textNode.id, newName: newName })
  }
  return result
}

async function main() {
  figma.showUI(__html__, {width:300, height: 200})

  const isSelectionMode = figma.currentPage.selection.length > 0
  const textNodes = isSelectionMode ? findAllTextNodesInSelection() : await findAllTextNodesInCurrentPage()
  const result = await filterRenamableTextNodes(textNodes)
  if (result.focusNodes.length > 0) {
    figma.currentPage.selection = result.focusNodes
    figma.viewport.scrollAndZoomIntoView(result.focusNodes)
  }
  figma.ui.postMessage({ type: 'renamable-nodes-found', renamableNodes: result.renamableNodes, isSelectionMode: isSelectionMode })

  figma.ui.onmessage = async (message) => {
    switch (message.type) {
      case 'rename':
        await figma.currentPage.loadAsync()
        const renamableNodes = message.renamableNodes as RenamableNode[]
        renamableNodes.forEach((renamableNode) => {
          const node = figma.currentPage.findOne((it) => it.id === renamableNode.nodeId)
          if (node !== null) {
            node.name = renamableNode.newName
          }
        })
        figma.ui.postMessage({ type: 'renamed', count: renamableNodes.length })
        break

      case 'exit':
        figma.closePlugin()
        break
    }
  }
}