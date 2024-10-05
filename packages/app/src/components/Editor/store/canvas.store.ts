import {defineStore} from 'statebuilder';
import panzoom, {type PanZoom} from 'panzoom';
import {createEffect, createSignal, on} from 'solid-js';
import {
  autocenter,
  fitToCenter,
  getScaleByRatio,
} from '../utils/getScaleByRatio';

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
    const [ref, setRef] = createSignal<HTMLElement | null>(null);
    return {
      instance,
      ref,
      connectRef: (el: HTMLDivElement) => {
        setInstance(
          panzoom(el, {
            autocenter: true,
          }),
        );
        setRef(el);

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
        const ref = _.ref()!;
        const {x, y, scale} = autocenter(ref);
        console.log(x, y, scale);
        instance.smoothMoveTo(x, y);
        // instance.smoothZoom(0, 0, scale);
      },
    };
  });
