
var idbApp = (function () {
  "use strict";

  var dbPromise = idb.open("couches", 3, function (updateDb) {
    console.log("Database version:", updateDb.oldVersion);
    
    if (!updateDb.objectStoreNames.contains("products")) {
      updateDb.createObjectStore("products", { keyPath: "id" });
    }
    
    var store = updateDb.transaction.objectStore("products");
    
    if (!store.indexNames.contains("name")) {
      store.createIndex("name", "name", { unique: true });
    }
    
    if (!store.indexNames.contains("price")) {
      store.createIndex("price", "price");
    }
    
    if (!store.indexNames.contains("description")) {
      store.createIndex("description", "description");
    }
  
  
  });

  function addProducts() {
    
    dbPromise
      .then((db) => {
        var tx = db.transaction("products", "readwrite");
        var store = tx.objectStore("products");
        var items = [
          {
            name: "Couch",
            id: "cch-blk-ma",
            price: 499.99,
            color: "black",
            material: "mahogany",
            description: "A very comfy couch",
            quantity: 3,
          },
          {
            name: "Armchair",
            id: "ac-gr-pin",
            price: 299.99,
            color: "grey",
            material: "pine",
            description: "A plush recliner armchair",
            quantity: 7,
          },
          {
            name: "Stool",
            id: "st-re-pin",
            price: 59.99,
            color: "red",
            material: "pine",
            description: "A light, high-stool",
            quantity: 3,
          },
          {
            name: "Chair",
            id: "ch-blu-pin",
            price: 49.99,
            color: "blue",
            material: "pine",
            description: "A plain chair for the kitchen table",
            quantity: 1,
          },
          {
            name: "Dresser",
            id: "dr-wht-ply",
            price: 399.99,
            color: "white",
            material: "plywood",
            description: "A plain dresser with five drawers",
            quantity: 4,
          },
          {
            name: "Cabinet",
            id: "ca-brn-ma",
            price: 799.99,
            color: "brown",
            material: "mahogany",
            description: "An intricately-designed, antique cabinet",
            quantity: 11,
          },
        ];

        return Promise.all(
          items.map((item) => {
            return store.add(item);
          })
        )
          .catch((err) => {
            tx.abort();
          })
          .then(() => {
            console.log("Products added successfully");
          });
      })
      .catch((err) => {
        console.log("error create DB");
      });
  }

  function getByName(key) {
    return dbPromise.then((db) => {
      var tx = db.transaction("products", "readonly");
      var store = tx.objectStore("products");
      var index = store.index("name");
      return index.get(key);
    });
  }

  function displayByName() {
    var key = document.getElementById("name").value;
    if (key === "") {
      return;
    }
    var s = "";
    getByName(key)
      .then(function (object) {
        if (!object) {
          return;
        }
        console.log(object);
        s += "<h2>" + object.name + "</h2><p>";
        for (var field in object) {
          s += field + " = " + object[field] + "<br/>";
        }
        s += "</p>";
      })
      .then(function () {
        if (s === "") {
          s = "<p>No results.</p>";
        }
        document.getElementById("results").innerHTML = s;
      });
  }

function getByPrice() {
  var lower = parseFloat(document.getElementById("priceLower").value) || 0;
  var upper = parseFloat(document.getElementById("priceUpper").value) || Infinity;

  return dbPromise.then((db) => {
    var tx = db.transaction("products", "readonly");
    var store = tx.objectStore("products");
    var index = store.index("price");
    var range = IDBKeyRange.bound(lower, upper, true, true);
    return index.openCursor(range);
  });
  
}

function displayByPrice(key) {
  
  var s = "";
  getByPrice(key)
    .then(function (object) {
      if (!object) {
        return;
      }
      console.log(object);
      let x = object._request.result.value
      console.log(x);
      
      s += "<h2>" + x.name + "</h2><p>";
      for (var field in x) {
        s += field + " = " + x[field] + "<br/>";
      }
      s += "</p>";
    })
    .then(function () {
      if (s === "") {
        s = "<p>No results.</p>";
      }
      document.getElementById("results").innerHTML = s;
    });
}

function getByDesc(key) {
  return dbPromise.then((db) => {
    var tx = db.transaction("products", "readonly");
    var store = tx.objectStore("products");
    var index = store.index("description");
    return index.get(key);
  });
}

function displayByDesc() {
  var key = document.getElementById("desc").value;
  console.log(key);
  
  if (key === "") {
    return;
  }
  var s = "";
  getByDesc(key)
    .then(function (object) {
      if (!object) {
        return;
      }
      console.log(object);
      s += "<h2>" + object.name + "</h2><p>";
      for (var field in object) {
        s += field + " = " + object[field] + "<br/>";
      }
      s += "</p>";
    })
    .then(function () {
      if (s === "") {
        s = "<p>No results.</p>";
      }
      document.getElementById("results").innerHTML = s;
    });
}

  
    
  function addOrders() {
  }

  
  function showOrders() {}

  function getOrders() {
  }

  function fulfillOrders() {
  
  }

  function processOrders(orders) {
  }

  function decrementQuantity(product, order) {
  }

  function updateProductsStore(products) {
  
  }

  return {
    dbPromise: dbPromise,
    addProducts: addProducts,
    getByName: getByName,
    displayByName: displayByName,
    getByPrice: getByPrice,
    displayByPrice:displayByPrice,
    getByDesc: getByDesc,
    displayByDesc:displayByDesc,
    addOrders: addOrders,
    showOrders: showOrders,
    getOrders: getOrders,
    fulfillOrders: fulfillOrders,
    processOrders: processOrders,
    decrementQuantity: decrementQuantity,
    updateProductsStore: updateProductsStore,
  };
})();
