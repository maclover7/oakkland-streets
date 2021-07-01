const { readFile, writeFile } = require('fs').promises;
const turf = require('@turf/turf');
const uniq = require('lodash.uniq');

const excludedStreets = [
  '2ND',
  '5TH',
  '5TH AVE TO BLVD OF THE ALLIES',
  'ALLEY',
  'BATES ST TO I376 EB',
  'BIRMINGHAM BRG TO FORBES AVE',
  'BLVD OF THE ALLIES TO I376 EB',
  'BLVD OF THE ALLIES TO I376 WB',
  'EAST BUSWAY',
  'FORBES AVE TO BIRMINGHAM BRG',
  'FOUR MILE RUN',
  'I376',
  'I376 EB TO FORBES AVE',
  'I376 WB TO BATES ST',
  'I376 WB TO BLVD OF THE ALLIES',
  'MONONGAHELA',
  'TECHNOLOGY',
  'UNIVERSITY',
  'UNIVERSITY A',
  'UNIVERSITY B',
  'UNIVERSITY C',
];

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
    streets.filter((street) => turf.booleanIntersects(ward, street) && !excludedStreets.includes(street.properties.ST_NAME))
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

const openJSONFile = (filename) => {
  return readFile(filename, { encoding: 'utf8' })
  .then((file) => Promise.resolve(JSON.parse(file)));
};

const saveStreets = (streets) => {
  return writeFile('./streets.csv', ['name', ...streets].join(",\n"));
};

const transformStreets = (streets) => {
  return Promise.resolve(
    uniq(
      streets
      .map((street) =>
        `${street.properties.ST_NAME} ${street.properties.ST_TYPE ? street.properties.ST_TYPE : ''}`
      )
      .sort()
    )
  );
};

const run = () => {
  return Promise.all([
    getOaklandWard(),
    getCityStreets()
  ])
  .then(getOaklandStreets)
  .then(transformStreets)
  .then(saveStreets)
  .then(() => console.log('DONE'));
};

run();
