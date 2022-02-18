# Blue Slider

*Blue Slider* is a custom html element.

## Usage:

```
<html>
  <body>
    <blue-slider></blue-slider>
  </body>
</html>
```
Shows a slider with six ticks from 0 to 5.

## Attributes:

- *ticks*: number of ticks (0 < ticks <= 11).
- *min*: lowest slider value (-5 <= min <= 5).
- *color*: color of ruler and labels, hex value (default: #000000, i.e. black).
- *select-color*: color of selected tick, hex value (default: #6fa5eb, i.e. blue).
- *feedback*: if set, the selected value is displayed to the right of the slider.
- *value*: the selected slider value (must be greater than *min* and less than *min + ticks - 1*).

Example:

```
<blue-slider ticks="11" min="-5"></blue-slider>
```

Shows a slider with 11 ticks from -5 to 5.

## Properties:

- *value*: the selected slider value