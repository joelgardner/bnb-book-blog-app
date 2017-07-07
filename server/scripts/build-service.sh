# capture the first parameter as $SERVICE
SERVICE=$1

# check that service is not empty
if [ -z "$SERVICE" ]; then
  echo "build-service.sh requires a single argument: the name of a directory src/services"
  exit
fi

# check that the service exists
if [ ! -d src/services/$SERVICE ]; then
  echo "Invalid service: src/services/$SERVICE does not exist!"
  exit
fi

echo "**********************************"
echo "Building src/services/$SERVICE"
echo "**********************************"

# delete and recreate a build/{serviceName} directory
rm -rf build/$SERVICE

# copy service directory contents (excluding node_modules)
rsync -r --exclude=node_modules src/services/$SERVICE build

# copy bnb-book-util directory
rsync -r --exclude=node_modules src/bnb-book-util build/$SERVICE

# build babel-transformed javascript in out/
./node_modules/.bin/babel --plugins babel-polyfill build/$SERVICE --out-dir build/$SERVICE

# update the package.json's dependencies.bnb-book-util path
./node_modules/.bin/json -I -f build/$SERVICE/package.json -e 'this.dependencies["bnb-book-util"]="file:./bnb-book-util"'
./node_modules/.bin/json -I -f build/$SERVICE/package-lock.json -e 'this.dependencies["bnb-book-util"].version="file:./bnb-book-util"'
