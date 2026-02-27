import * as React from 'react';
import { ImageLayer, ImageWindow } from '../../model/encounter';

const ImageLayerView: React.FC<{ layer: ImageLayer; }> = ({ layer }) => {
  return (
    <img
      src={layer.src}
      draggable={false}
      style={{
        inset: 0,
        width: '100%',
        height: '100%',
        objectFit: layer.fit ?? 'contain',
        objectPosition: 'bottom center',
      }} />
  );
};

export const ImageWindowContent = (props: { imageWindow: ImageWindow; }): JSX.Element[] => {
  return props.imageWindow.layers.map((layer, i) => <ImageLayerView key={i} layer={layer} />);
};
