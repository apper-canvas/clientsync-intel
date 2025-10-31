import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";

const dealStages = ["Lead", "Qualified", "Proposal", "Negotiation", "Closed Won", "Closed Lost"];

export const dealsService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords('deal_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "value_c"}},
          {"field": {"Name": "stage_c"}},
          {"field": {"Name": "probability_c"}},
          {"field": {"Name": "closeDate_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "createdAt_c"}},
          {"field": {"Name": "contactId_c"}, "referenceField": {"field": {"Name": "Name"}}},
          {"field": {"Name": "companyId_c"}, "referenceField": {"field": {"Name": "name_c"}}}
        ]
      });
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching deals:", error);
      toast.error("Failed to load deals");
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.getRecordById('deal_c', parseInt(id), {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "value_c"}},
          {"field": {"Name": "stage_c"}},
          {"field": {"Name": "probability_c"}},
          {"field": {"Name": "closeDate_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "createdAt_c"}},
          {"field": {"Name": "contactId_c"}, "referenceField": {"field": {"Name": "Name"}}},
          {"field": {"Name": "companyId_c"}, "referenceField": {"field": {"Name": "name_c"}}}
        ]
      });
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching deal ${id}:`, error);
      toast.error("Failed to load deal");
      return null;
    }
  },

  async create(dealData) {
    try {
      const apperClient = getApperClient();
      const params = {
        records: [{
          title_c: dealData.title_c,
          value_c: parseFloat(dealData.value_c),
          stage_c: dealData.stage_c,
          probability_c: parseInt(dealData.probability_c),
          closeDate_c: dealData.closeDate_c,
          notes_c: dealData.notes_c || "",
          contactId_c: parseInt(dealData.contactId_c),
          companyId_c: parseInt(dealData.companyId_c),
          createdAt_c: new Date().toISOString()
        }]
      };
      
      const response = await apperClient.createRecord('deal_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to create deal:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          return null;
        }
        return response.results[0].data;
      }
      
      return null;
    } catch (error) {
      console.error("Error creating deal:", error);
      toast.error("Failed to create deal");
      return null;
    }
  },

  async update(id, dealData) {
    try {
      const apperClient = getApperClient();
      const params = {
        records: [{
          Id: parseInt(id),
          title_c: dealData.title_c,
          value_c: parseFloat(dealData.value_c),
          stage_c: dealData.stage_c,
          probability_c: parseInt(dealData.probability_c),
          closeDate_c: dealData.closeDate_c,
          notes_c: dealData.notes_c || "",
          contactId_c: parseInt(dealData.contactId_c),
          companyId_c: parseInt(dealData.companyId_c)
        }]
      };
      
      const response = await apperClient.updateRecord('deal_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to update deal:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          return null;
        }
        return response.results[0].data;
      }
      
      return null;
    } catch (error) {
      console.error("Error updating deal:", error);
      toast.error("Failed to update deal");
      return null;
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient();
      const params = { RecordIds: [parseInt(id)] };
      
      const response = await apperClient.deleteRecord('deal_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }
      
      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to delete deal:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          return false;
        }
      }
      
      return true;
    } catch (error) {
      console.error("Error deleting deal:", error);
      toast.error("Failed to delete deal");
      return false;
    }
  },

  async updateStage(id, newStage) {
    try {
      if (!dealStages.includes(newStage)) {
        toast.error("Invalid deal stage");
        return null;
      }
      
      const apperClient = getApperClient();
      const probability = newStage === "Closed Won" ? 100 : newStage === "Closed Lost" ? 0 : null;
      
      const params = {
        records: [{
          Id: parseInt(id),
          stage_c: newStage,
          ...(probability !== null && { probability_c: probability })
        }]
      };
      
      const response = await apperClient.updateRecord('deal_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to update deal stage:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          return null;
        }
        return response.results[0].data;
      }
      
      return null;
    } catch (error) {
      console.error("Error updating deal stage:", error);
      toast.error("Failed to update deal stage");
      return null;
    }
  },

  async getDealsByStage() {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords('deal_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "value_c"}},
          {"field": {"Name": "stage_c"}},
          {"field": {"Name": "probability_c"}},
          {"field": {"Name": "closeDate_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "createdAt_c"}},
          {"field": {"Name": "contactId_c"}, "referenceField": {"field": {"Name": "Name"}}},
          {"field": {"Name": "companyId_c"}, "referenceField": {"field": {"Name": "name_c"}}}
        ]
      });
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return {};
      }
      
      const deals = response.data || [];
      const dealsByStage = {};
      dealStages.forEach(stage => {
        dealsByStage[stage] = deals.filter(deal => deal.stage_c === stage);
      });
      
      return dealsByStage;
    } catch (error) {
      console.error("Error fetching deals by stage:", error);
      toast.error("Failed to load deals");
      return {};
    }
  },

  getDealStages() {
    return [...dealStages];
  }
};