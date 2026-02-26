import * as React from 'react';
import { ImageLayer, ImageWindow } from '../../model/encounter';

const ImageLayerView: React.FC<{ layer: ImageLayer; }> = ({ layer }) => {
  return (
    <img
      src={layer.src}
      draggable={false}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        objectFit: layer.fit ?? 'contain',
        objectPosition: 'bottom center',
        zIndex: layer.z ?? 0,
      }} />
  );
};

export const ImageWindowContent = (props: { imageWindow: ImageWindow; }): JSX.Element[] => {
  return props.imageWindow.layers.map((layer, i) => <ImageLayerView key={i} layer={layer} />);
};
