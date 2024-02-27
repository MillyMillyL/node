function APIFeatures(query, queryString) {
  // eslint-disable-next-line node/no-unsupported-features/es-syntax
  const queryObj = { ...queryString };
  const excludedFields = ['page', 'sort', 'limit', 'fields'];
  excludedFields.forEach((el) => delete queryObj[el]);

  let queryStr = JSON.stringify(queryObj);
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

  if (queryStr !== '{}') {
    query = query.find(JSON.parse(queryStr));
  }

  if (queryString.sort) {
    const sortBy = queryString.sort.split(',').join('');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  if (queryString.fields) {
    const fields = queryString.fields.split(',').join(' ');
    query = query.select(fields);
  } else {
    query = query.select('-__v');
  }

  const page = queryString.page * 1 || 1;
  const limit = queryString.limit * 1 || 100;
  const skip = (page - 1) * limit;

  query = query.skip(skip).limit(limit);

  return query;
}

module.exports = APIFeatures;
