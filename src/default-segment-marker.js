/**
 * @file
 *
 * Defines the {@link DefaultSegmentMarker} class.
 *
 * @module default-segment-marker
 */

import { Line } from 'konva/lib/shapes/Line';
import { Rect } from 'konva/lib/shapes/Rect';
import { Text } from 'konva/lib/shapes/Text';

/**
 * Creates a segment marker handle.
 *
 * @class
 * @alias DefaultSegmentMarker
 *
 * @param {CreateSegmentMarkerOptions} options
 */

function DefaultSegmentMarker(options) {
  this._options = options;
}

DefaultSegmentMarker.prototype.init = function(group) {
  const handleWidth  = 15;
  const handleHeight = this._options.layer.getHeight();
  let handleX      = -(handleWidth / 2) + 8; // Place off to the side of the segment

  handleX = this._options.startMarker ? (handleX * -1) - 14 : handleX;

  const xPosition = this._options.startMarker ? -24 : 24;

  const time = this._options.startMarker ? this._options.segment.startTime :
                                           this._options.segment.endTime;

  // Label - create with default y, the real value is set in fitToView().
  this._label = new Text({
    x:          xPosition,
    y:          0,
    text:       this._options.layer.formatTime(time),
    fontFamily: this._options.fontFamily,
    fontSize:   this._options.fontSize,
    fontStyle:  this._options.fontStyle,
    fill:       '#000',
    textAlign:  'center'
  });

  this._label.hide();

  // Handle - create with default y, the real value is set in fitToView().
  this._handle = new Rect({
    x:           handleX,
    y:           0,
    width:       handleWidth,
    height:      handleHeight,
    fill:        this._options.color,
    stroke:      this._options.color,
    strokeWidth: 1
  });

  this._handleLineOne = new Rect({
    x: handleX + 4.5,
    y: 0,
    width: 0.5,
    height: 16,
    fill: '#FFFFFFBF',
    stroke: '#FFFFFFBF',
    strokeWidth: 1
  });

  this._handleLineTwo = new Rect({
    x: handleX + 9.5,
    y: 0,
    width: 0.5,
    height: 16,
    fill: '#FFFFFFBF',
    stroke: '#FFFFFFBF',
    strokeWidth: 1
  });

  // Vertical Line - create with default y and points, the real values
  // are set in fitToView().
  this._line = new Line({
    x:           0,
    y:           0,
    stroke:      this._options.strokeColor,
    strokeWidth: 1
  });

  group.add(this._label);
  group.add(this._line);
  group.add(this._handleLineOne);
  group.add(this._handleLineTwo);
  group.add(this._handle);

  this.fitToView();

  this.bindEventHandlers(group);
};

DefaultSegmentMarker.prototype.bindEventHandlers = function(group) {
  const self = this;

  // const xPosition = self._options.startMarker ? -24 : 24;

  if (self._options.draggable) {
    group.on('dragstart', function() {
      self._handle.attrs.fill = '#3641414D'; // neutral-800 .30a
      self._handle.attrs.stroke = '#3641414D'; // neutral-800 .30a
      // if (self._options.startMarker) {
      //   self._label.setX(xPosition - self._label.getWidth());
      // }

      // self._label.show();
    });

    group.on('dragend', function() {
      // self._label.hide();
    });
  }

  self._handle.on('mouseover touchstart', function() {
    document.body.style.cursor = 'col-resize';
    self._handle.attrs.fill = '#3641414D'; // neutral-800 .30a
    self._handle.attrs.stroke = '#3641414D'; // neutral-800 .30a
    // if (self._options.startMarker) {
    //   self._label.setX(xPosition - self._label.getWidth());
    // }

    // self._label.show();
    this.parent.parent.draw();
  });

  self._handle.on('mouseout touchend', function() {
    document.body.style.cursor = 'default';
    self._handle.attrs.fill = '#6E797A4D'; // neutral-600 .30a
    self._handle.attrs.stroke = '#6E797A4D'; // neutral-600 .30a
    // self._label.hide();
    this.parent.parent.draw();
  });
};

DefaultSegmentMarker.prototype.fitToView = function() {
  const height = this._options.layer.getHeight();

  this._label.y(height / 2 - 5);
  this._handle.y(height / 2 + 45);
  this._handleLineOne.y(height / 2 + 61);
  this._handleLineTwo.y(height / 2 + 61);
  this._line.points([0.5, 0, 0.5, height]);
};

DefaultSegmentMarker.prototype.timeUpdated = function(time) {
  this._label.setText(this._options.layer.formatTime(time));
};

export default DefaultSegmentMarker;
