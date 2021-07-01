const { readFile } = require('fs').promises;
const turf = require('@turf/turf');
const uniq = require('lodash.uniq');

const getCityStreets = () => {
  return openJSONFile('./alleghenycounty_streetcenterlines202106.geojson')
  .then((features) => {
    return Promise.resolve(
      features.features.filter((f) => f.properties.RMUNI === "PITTSBURGH")
    );
  });
};

const getOaklandStreets = ([ward, streets]) => {
  return Promise.resolve(
    streets.filter((street) => turf.booleanIntersects(ward, street))
  );
};

const getOaklandWard = () => {
  return openJSONFile('./Pittsburgh_Wards.geojson')
  .then((wards) => {
    return Promise.resolve(
      wards.features.filter((ward) => ward.properties.ward === 4)[0]
    );
  });
};

const listStreets = (streets) => {
  const parsedStreets = uniq(streets.map((street) => `${street.properties.ST_NAME} ${street.properties.ST_TYPE ? street.properties.ST_TYPE : ''}`));
  console.log(parsedStreets);
}

const openJSONFile = (filename) => {
  return readFile(filename, { encoding: 'utf8' })
  .then((file) => Promise.resolve(JSON.parse(file)));
};

const run = () => {
  return Promise.all([
    getOaklandWard(),
    getCityStreets()
  ])
  .then(getOaklandStreets)
  .then(listStreets);
};

run();
