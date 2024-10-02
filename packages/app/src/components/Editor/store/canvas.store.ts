import {defineStore} from 'statebuilder';
import panzoom, {type PanZoom} from 'panzoom';
import {createEffect, createSignal, on} from 'solid-js';

interface CanvasState {
  scale: number;
  connected: boolean;
}

export const CanvasStore = defineStore<CanvasState>(() => ({
  scale: 1,
  connected: false,
}))
  .extend(_ => {
    const [instance, setInstance] = createSignal<PanZoom | null>(null);
    return {
      instance,
      connectRef: (el: HTMLDivElement) => {
        setInstance(panzoom(el));

        _.set('connected', true);
      },
    };
  })
  .extend(_ => {
    createEffect(
      on([() => _.get.connected, _.instance], ([connected, instance]) => {
        if (!connected) {
          return;
        }
        instance!.on('zoom', () => {
          _.set('scale', instance!.getTransform().scale);
        });
      }),
    );

    return {
      fitToCenter: () => {
        const instance = _.instance()!;
        instance.centerOn(
          document.querySelector('.Canvas_canvasContainer__11d9l720'),
        );
        instance.moveBy(0, 0, true);
      },
    };
  });
