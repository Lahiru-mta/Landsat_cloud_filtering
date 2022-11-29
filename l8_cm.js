var l8raw = ee.ImageCollection("LANDSAT/LC08/C02/T1"),
    Ratnapura = ee.FeatureCollection("projects/ee-research16ges868/assets/Ratnapura");

var year = '2022';
var resolution = 30;


var ratnapura = Ratnapura;
var roi = ((ratnapura.geometry().bounds(100)).buffer(1000, 100)).bounds(100);
//Define a true color visualization for Landsat 8.
var trueColorVis = {min: 0, max: 0.3, bands: ["B4", "B3", "B2"]};
// SimpleComposite
var l8raw = l8raw.filterBounds (roi) ;
var composite = ee.Algorithms.Landsat.simpleComposite({
  collection: l8raw. filterDate( year+"-01-01", year+"-12-31"),
  asFloat: true
});
var img = composite.clip(roi);
Map.addLayer (img, trueColorVis, "Landsat Composite");
Map.centerObject (roi, 10);

var projection = img.select('B2').projection().getInfo();
Export.image.toDrive({
  image: img,
  description: 'l8_'+year,
  crs: projection.crs,
  scale: resolution,
  folder: 'ls8',
  region: roi
});