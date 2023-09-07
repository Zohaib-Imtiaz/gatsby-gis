import * as React from "react";
import "./Loader.css";

export const ShapeLoader = () => {
  return <div className="shape_loader" />;
};

export const WordLoader = () => {
  return <div className="word_loader" />;
};

export const WordColorChangeLoader = () => {
  return <div className="color_changing_word_loader" />;
};

export const MapDataLoader = () => {
  return (
    <div id='mapdata-loader' className="mapdata_loading_container">
      <div className="align_items_with_gap">
        <ShapeLoader /> <WordColorChangeLoader />
      </div>
    </div>
  );
};
