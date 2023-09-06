import mapboxgl from "mapbox-gl";
import * as React from "react";
import { createPortal } from "react-dom";
import { MapContext } from "../instance";

interface PopupProps {
  show?: true | false;
  lngLat?: mapboxgl.LngLatLike;
  onClose?: () => {};
  children?: React.ReactNode;
}

const Popup = React.memo(({ show, lngLat, children, onClose }: PopupProps) => {
  const Map = React.useContext(MapContext);

  const container = React.useMemo(() => {
    const element = document.createElement("div");
    element.className = "mapbox_popup";
    return element;
  }, []);

  const popup = React.useMemo(() => {
    return new mapboxgl.Popup();
  }, []);

  React.useEffect(() => {
    if (Map === undefined || Map === null) {
      console.error("PopUp can only be used under MapboxReact");
      return;
    }

    popup.setDOMContent(container ?? <h1>No Content</h1>);
    if (lngLat) {
      popup.setLngLat(lngLat);
    }
    popup.addTo(Map);

    // return () => {
    //   popup.off("close", onClose);
    //   if (popup.isOpen()) {
    //     popup.remove();
    //   }
    // };
  }, [lngLat]);

  return createPortal(children, container);
});

export default Popup;
