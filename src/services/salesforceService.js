// API services for Salesforce operations

// Execute SOQL Query
export const executeQuery = async (token, instanceUrl, query) => {
    try {
      const response = await fetch('/api/salescloud', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessToken: token, instanceUrl, query }),
      });
      
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Query execution failed');
      return result.records || [];
    } catch (err) {
      throw new Error(err.message || 'Unknown error');
    }
  };
  
  // Execute DML operations (Create, Update, Delete)
  export const executeDML = async (token, instanceUrl, operation, objectType, data, id = null) => {
    try {
      const response = await fetch('/api/salescloud/dml', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accessToken: token,
          instanceUrl,
          operation,
          objectType,
          data,
          id
        }),
      });
      
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Operation failed');
      return result;
    } catch (err) {
      throw new Error(err.message || 'Unknown error');
    }
  };
  
  // Convert Lead
  export const convertLead = async (token, instanceUrl, leadId, createOpportunity) => {
    // try {
    //   const response = await fetch('/api/salescloud/convert', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({
    //       accessToken: token,
    //       instanceUrl,
    //       leadId,
    //       createOpportunity
    //     }),
    //   });
      
    //   const result = await response.json();
    //   if (!response.ok) throw new Error(result.error || 'Lead conversion failed');
    //   return result;
    // } catch (err) {
    //   throw new Error(err.message || 'Unknown error');
    // }

    try {
      const response = await fetch('/api/salescloud/convert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accessToken: token,
          instanceUrl,
          leadId,
          createOpportunity,
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to convert lead');
      }
  
      return await response.json();
    } catch (error) {
      console.error('Error converting lead:', error);
      throw error;
    }
  };
  
  // Fetch Leads
  export const fetchLeads = async (token, instanceUrl) => {
    return executeQuery(
      token,
      instanceUrl,
      'SELECT Id, FirstName, LastName, Company, Email, Phone, Status FROM Lead ORDER BY CreatedDate DESC LIMIT 50'
    );
  };
  
  // Fetch Opportunities
  export const fetchOpportunities = async (token, instanceUrl) => {
    return executeQuery(
      token,
      instanceUrl,
      'SELECT Id, Name, StageName, CloseDate, Amount FROM Opportunity ORDER BY CloseDate DESC LIMIT 50'
    );
  };
  
  // Fetch Accounts
  export const fetchAccounts = async (token, instanceUrl) => {
    return executeQuery(
      token,
      instanceUrl,
      'SELECT Id, Name FROM Account ORDER BY Name ASC LIMIT 100'
    );
  };
  
  // Fetch Contacts
  export const fetchContacts = async (token, instanceUrl) => {
    return executeQuery(
      token,
      instanceUrl,
      'SELECT Id, FirstName, LastName FROM Contact ORDER BY LastName ASC LIMIT 100'
    );
  };


  