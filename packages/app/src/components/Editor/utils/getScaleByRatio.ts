import type {PanZoom, PanZoomController} from 'panzoom';

export function getScaleByRatio(
  parent: HTMLElement | undefined | null,
  child: HTMLElement | undefined | null,
  offset = 1,
): number {
  if (!parent || !child) {
    return 1;
  }

  if (
    child.clientWidth > parent.clientWidth &&
    child.clientHeight > parent.clientHeight
  ) {
    const hRatio = parent.clientWidth / child.clientWidth;
    const vRatio = parent.clientHeight / child.clientHeight;
    return Math.min(hRatio, vRatio) / offset;
  } else {
    if (child.clientHeight > parent.clientHeight) {
      return parent.clientHeight / child.clientHeight / offset;
    }

    if (child.clientWidth > parent.clientWidth) {
      return parent.clientWidth / child.clientWidth / offset;
    }
  }
  return 1;
}

export function fitToCenter(element: HTMLElement) {
  const clientRect = element.getBoundingClientRect();
  const cx = clientRect.left + clientRect.width / 2;
  const cy = clientRect.top + clientRect.height / 2;

  const container = element.parentElement!.getBoundingClientRect();
  const dx = container.width / 2 - cx;
  const dy = container.height / 2 - cy;

  return {
    dx,
    dy,
  };
}

function getBBox(domElement: HTMLElement) {
  // TODO: We should probably cache this?
  return {
    left: 0,
    top: 0,
    width: domElement.clientWidth,
    height: domElement.clientHeight,
  };
}

function getBoundingBox(owner: HTMLElement, boundsPadding = 0.05) {
  // for boolean type we use parent container bounds
  var ownerRect = owner.getBoundingClientRect();
  var sceneWidth = ownerRect.width;
  var sceneHeight = ownerRect.height;

  return {
    left: sceneWidth * boundsPadding,
    top: sceneHeight * boundsPadding,
    right: sceneWidth * (1 - boundsPadding),
    bottom: sceneHeight * (1 - boundsPadding),
  };
}

export function autocenter(element: HTMLElement) {
  const owner = element.parentElement!;

  let w; // width of the parent
  let h; // height of the parent
  let left = 0;
  let top = 0;
  const sceneBoundingBox = getBoundingBox(owner);
  if (sceneBoundingBox) {
    // If we have bounding box - use it.
    left = sceneBoundingBox.left;
    top = sceneBoundingBox.top;
    w = sceneBoundingBox.right - sceneBoundingBox.left;
    h = sceneBoundingBox.bottom - sceneBoundingBox.top;
  } else {
    // otherwise just use whatever space we have
    const ownerRect = owner.getBoundingClientRect();
    w = ownerRect.width;
    h = ownerRect.height;
  }
  const bbox = getBBox(owner);
  const dh = h / bbox.height;
  const dw = w / bbox.width;
  const scale = Math.min(dw, dh);
  return {
    x: -(bbox.left + bbox.width / 2) * scale + w / 2 + left,
    y: -(bbox.top + bbox.height / 2) * scale + h / 2 + top,
    scale: scale,
  };
}
