import React from 'react';
import { useDispatch } from 'react-redux';

const Widget = ({ widget, categoryId }) => {
  const dispatch = useDispatch();

  const removeWidget = () => {
    dispatch({
      type: 'REMOVE_WIDGET',
      payload: { categoryId, widgetId: widget.id },
    });
  };

  return (
    <div className="widget">
      <h3>{widget.name}</h3>
      <p>{widget.text}</p>
      <button onClick={removeWidget}>X</button>
    </div>
  );
};

export default Widget;
