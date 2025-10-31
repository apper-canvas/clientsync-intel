import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";

export const companiesService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords('company_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "industry_c"}},
          {"field": {"Name": "size_c"}},
          {"field": {"Name": "website_c"}},
          {"field": {"Name": "address_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "createdAt_c"}}
        ]
      });
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching companies:", error);
      toast.error("Failed to load companies");
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.getRecordById('company_c', parseInt(id), {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "industry_c"}},
          {"field": {"Name": "size_c"}},
          {"field": {"Name": "website_c"}},
          {"field": {"Name": "address_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "createdAt_c"}}
        ]
      });
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching company ${id}:`, error);
      toast.error("Failed to load company");
      return null;
    }
  },

  async create(companyData) {
    try {
      const apperClient = getApperClient();
      const params = {
        records: [{
          name_c: companyData.name_c,
          industry_c: companyData.industry_c,
          size_c: companyData.size_c,
          website_c: companyData.website_c || "",
          address_c: companyData.address_c || "",
          notes_c: companyData.notes_c || "",
          createdAt_c: new Date().toISOString()
        }]
      };
      
      const response = await apperClient.createRecord('company_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to create company:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          return null;
        }
        return response.results[0].data;
      }
      
      return null;
    } catch (error) {
      console.error("Error creating company:", error);
      toast.error("Failed to create company");
      return null;
    }
  },

  async update(id, companyData) {
    try {
      const apperClient = getApperClient();
      const params = {
        records: [{
          Id: parseInt(id),
          name_c: companyData.name_c,
          industry_c: companyData.industry_c,
          size_c: companyData.size_c,
          website_c: companyData.website_c || "",
          address_c: companyData.address_c || "",
          notes_c: companyData.notes_c || ""
        }]
      };
      
      const response = await apperClient.updateRecord('company_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to update company:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          return null;
        }
        return response.results[0].data;
      }
      
      return null;
    } catch (error) {
      console.error("Error updating company:", error);
      toast.error("Failed to update company");
      return null;
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient();
      const params = { RecordIds: [parseInt(id)] };
      
      const response = await apperClient.deleteRecord('company_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }
      
      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to delete company:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          return false;
        }
      }
      
      return true;
    } catch (error) {
      console.error("Error deleting company:", error);
      toast.error("Failed to delete company");
      return false;
    }
  },

  async searchCompanies(query) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords('company_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "industry_c"}},
          {"field": {"Name": "size_c"}},
          {"field": {"Name": "website_c"}},
          {"field": {"Name": "address_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "createdAt_c"}}
        ],
        whereGroups: query ? [{
          operator: "OR",
          subGroups: [
            {
              conditions: [
                {
                  fieldName: "name_c",
                  operator: "Contains",
                  values: [query]
                },
                {
                  fieldName: "industry_c",
                  operator: "Contains",
                  values: [query]
                },
                {
                  fieldName: "size_c",
                  operator: "Contains",
                  values: [query]
                }
              ],
              operator: "OR"
            }
          ]
        }] : []
      });
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error searching companies:", error);
      return [];
    }
  }
};