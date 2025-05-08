// // src\app\api\bjectsinfo\route.jsx
// const { NextResponse } = require('next/server');
// const jsforce = require('jsforce');

// async function POST(request) {
//   try {
//     const { accessToken, instanceUrl } = await request.json();

//     if (!accessToken || !instanceUrl) {
//       return NextResponse.json(
//         { error: 'Missing required parameters' },
//         { status: 400 }
//       );
//     }

//     const conn = new jsforce.Connection({
//       instanceUrl,
//       accessToken,
//     });

//     // 🔹 Step 1: Describe all global objects
//     const globalDesc = await conn.describeGlobal();

//     // 🔹 Step 2: Filter only custom and standard business objects (skip system)
//     const filteredObjects = globalDesc.sobjects.filter(obj =>
//       (obj.custom || (!obj.custom && obj.queryable && obj.searchable && !obj.name.endsWith('__Share')))
//     );
//    console.log("Filtered objects count:", filteredObjects);
//     const objectNames = filteredObjects.map(obj => obj.name);
//     console.log("Filtered object names:", objectNames.length);

//     const allSchemas = [];

//     // 🔹 Step 3: Fetch describe() for each object
//     for (let name of objectNames) {
//       const desc = await conn.sobject(name).describe();

//       allSchemas.push({
//         name: desc.name,
//         label: desc.label,
//         custom: desc.custom,
//         fields: desc.fields.map(field => ({
//           name: field.name,
//           label: field.label,
//           type: field.type,
//           referenceTo: field.referenceTo,
//           relationshipName: field.relationshipName,
//           relationshipOrder: field.relationshipOrder,
//           required: field.nillable === false,
//         })),
//       });
//     }

//     return NextResponse.json({
//       success: true,
//       objects: allSchemas,
//     });

//   } catch (error) {
//     console.error('Salesforce schema fetch error:', error);
//     return NextResponse.json(
//       { error: error instanceof Error ? error.message : 'An error occurred' },
//       { status: 500 }
//     );
//   }
// }

// module.exports = { POST };


// const { NextResponse } = require('next/server');
// const jsforce = require('jsforce');

// async function POST(request) {
//   try {
//     const { accessToken, instanceUrl } = await request.json();

//     if (!accessToken || !instanceUrl) {
//       return NextResponse.json(
//         { error: 'Missing required parameters' },
//         { status: 400 }
//       );
//     }

//     const conn = new jsforce.Connection({
//       instanceUrl,
//       accessToken,
//     });

//     // 🔹 Step 1: Describe all global objects
//     const globalDesc = await conn.describeGlobal();

//     // 🔹 Step 2: Filter only custom and standard business objects (skip system)
//     const filteredObjects = globalDesc.sobjects.filter(obj =>
//       (obj.custom || (!obj.custom && obj.queryable && obj.searchable && !obj.name.endsWith('__Share')))
//     );

//     console.log("Filtered objects count:", filteredObjects.length);

//     // 🔹 Step 3: Limit to 50 objects
//     const objectNames = filteredObjects.map(obj => obj.name).slice(0, 50);

//     console.log("Describing objects:", objectNames);

//     const allSchemas = [];

//     for (let name of objectNames) {
//       const desc = await conn.sobject(name).describe();

//       allSchemas.push({
//         name: desc.name,
//         label: desc.label,
//         custom: desc.custom,
//         fields: desc.fields.map(field => ({
//           name: field.name,
//           label: field.label,
//           type: field.type,
//           referenceTo: field.referenceTo,
//           relationshipName: field.relationshipName,
//           relationshipOrder: field.relationshipOrder,
//           required: field.nillable === false,
//         })),
//       });
//     }

//     return NextResponse.json({
//       success: true,
//       objects: allSchemas,
//     });

//   } catch (error) {
//     console.error('Salesforce schema fetch error:', error);
//     return NextResponse.json(
//       { error: error instanceof Error ? error.message : 'An error occurred' },
//       { status: 500 }
//     );
//   }
// }

// module.exports = { POST };


const { NextResponse } = require('next/server');
const jsforce = require('jsforce');

async function POST(request) {
  try {
    const { accessToken, instanceUrl } = await request.json();
    
    if (!accessToken || !instanceUrl) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }
    
    const conn = new jsforce.Connection({
      instanceUrl,
      accessToken,
    });
    
    // 🔹 Step 1: Describe global objects in a single request
    const globalDesc = await conn.describeGlobal();
    
    // 🔹 Step 2: Filter relevant objects (custom + important standard objects)
    const filteredObjects = globalDesc.sobjects.filter(obj => 
      (obj.custom || 
       (!obj.custom && obj.queryable && obj.searchable && 
        !obj.name.endsWith('__Share') && !obj.name.endsWith('__History') &&
        !obj.name.endsWith('__Feed') && !obj.name.endsWith('__c')))
    );
    
    console.log("Filtered objects count:", filteredObjects.length);
    
    // 🔹 Step 3: Limit to 50 objects to prevent timeout
    const objectsToFetch = filteredObjects.slice(0, 50);
    
    // 🔹 Step 4: Use Promise.all to fetch all object descriptions in parallel
    // This drastically reduces API request time compared to sequential requests
    const objectPromises = objectsToFetch.map(obj => 
      conn.sobject(obj.name).describe()
    );
    
    const objectDescriptions = await Promise.all(objectPromises);
    
    // 🔹 Step 5: Process and format the results
    const allSchemas = objectDescriptions.map(desc => ({
      name: desc.name,
      label: desc.label,
      custom: desc.custom,
      keyFields: desc.fields
        .filter(f => f.nameField || f.unique || f.idLookup || f.updateable === false)
        .slice(0, 5)  // Include up to 5 key fields to display in the node
        .map(f => ({ name: f.name, label: f.label })),
      fields: desc.fields.map(field => ({
        name: field.name,
        label: field.label,
        type: field.type,
        referenceTo: field.referenceTo,
        relationshipName: field.relationshipName,
        required: field.nillable === false,
        nameField: field.nameField,
        unique: field.unique,
        externalId: field.externalId,
        idLookup: field.idLookup,
        updateable: field.updateable
      })),
    }));

    return NextResponse.json({
      success: true,
      objects: allSchemas,
    });
    
  } catch (error) {
    console.error('Salesforce schema fetch error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An error occurred' },
      { status: 500 }
    );
  }
}

module.exports = { POST };