import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";

const activityTypes = ["Call", "Email", "Meeting", "Task", "Note"];

export const activitiesService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords('activity_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "subject_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "dueDate_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "createdAt_c"}},
          {"field": {"Name": "contactId_c"}, "referenceField": {"field": {"Name": "Name"}}},
          {"field": {"Name": "dealId_c"}, "referenceField": {"field": {"Name": "title_c"}}}
        ]
      });
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching activities:", error);
      toast.error("Failed to load activities");
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.getRecordById('activity_c', parseInt(id), {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "subject_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "dueDate_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "createdAt_c"}},
          {"field": {"Name": "contactId_c"}, "referenceField": {"field": {"Name": "Name"}}},
          {"field": {"Name": "dealId_c"}, "referenceField": {"field": {"Name": "title_c"}}}
        ]
      });
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching activity ${id}:`, error);
      toast.error("Failed to load activity");
      return null;
    }
  },

  async create(activityData) {
    try {
      const apperClient = getApperClient();
      const params = {
        records: [{
          type_c: activityData.type_c,
          subject_c: activityData.subject_c,
          description_c: activityData.description_c,
          dueDate_c: activityData.dueDate_c,
          completed_c: activityData.completed_c || false,
          contactId_c: activityData.contactId_c ? parseInt(activityData.contactId_c) : null,
          dealId_c: activityData.dealId_c ? parseInt(activityData.dealId_c) : null,
          createdAt_c: new Date().toISOString()
        }]
      };
      
      const response = await apperClient.createRecord('activity_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to create activity:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          return null;
        }
        return response.results[0].data;
      }
      
      return null;
    } catch (error) {
      console.error("Error creating activity:", error);
      toast.error("Failed to create activity");
      return null;
    }
  },

  async update(id, activityData) {
    try {
      const apperClient = getApperClient();
      const params = {
        records: [{
          Id: parseInt(id),
          type_c: activityData.type_c,
          subject_c: activityData.subject_c,
          description_c: activityData.description_c,
          dueDate_c: activityData.dueDate_c,
          completed_c: activityData.completed_c,
          contactId_c: activityData.contactId_c ? parseInt(activityData.contactId_c) : null,
          dealId_c: activityData.dealId_c ? parseInt(activityData.dealId_c) : null
        }]
      };
      
      const response = await apperClient.updateRecord('activity_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to update activity:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          return null;
        }
        return response.results[0].data;
      }
      
      return null;
    } catch (error) {
      console.error("Error updating activity:", error);
      toast.error("Failed to update activity");
      return null;
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient();
      const params = { RecordIds: [parseInt(id)] };
      
      const response = await apperClient.deleteRecord('activity_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }
      
      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to delete activity:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          return false;
        }
      }
      
      return true;
    } catch (error) {
      console.error("Error deleting activity:", error);
      toast.error("Failed to delete activity");
      return false;
    }
  },

  async getByContactId(contactId) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords('activity_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "subject_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "dueDate_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "createdAt_c"}},
          {"field": {"Name": "contactId_c"}},
          {"field": {"Name": "dealId_c"}}
        ],
        where: [{
          FieldName: "contactId_c",
          Operator: "EqualTo",
          Values: [parseInt(contactId)]
        }]
      });
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching activities by contact:", error);
      return [];
    }
  },

  async getByDealId(dealId) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords('activity_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "subject_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "dueDate_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "createdAt_c"}},
          {"field": {"Name": "contactId_c"}},
          {"field": {"Name": "dealId_c"}}
        ],
        where: [{
          FieldName: "dealId_c",
          Operator: "EqualTo",
          Values: [parseInt(dealId)]
        }]
      });
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching activities by deal:", error);
      return [];
    }
  },

  async markCompleted(id) {
    try {
      const apperClient = getApperClient();
      const params = {
        records: [{
          Id: parseInt(id),
          completed_c: true
        }]
      };
      
      const response = await apperClient.updateRecord('activity_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to mark activity completed:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          return null;
        }
        return response.results[0].data;
      }
      
      return null;
    } catch (error) {
      console.error("Error marking activity completed:", error);
      toast.error("Failed to update activity");
      return null;
    }
  },

  async getUpcoming(limit = 10) {
    try {
      const apperClient = getApperClient();
      const now = new Date().toISOString();
      
      const response = await apperClient.fetchRecords('activity_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "subject_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "dueDate_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "createdAt_c"}},
          {"field": {"Name": "contactId_c"}, "referenceField": {"field": {"Name": "Name"}}},
          {"field": {"Name": "dealId_c"}, "referenceField": {"field": {"Name": "title_c"}}}
        ],
        where: [
          {
            FieldName: "completed_c",
            Operator: "EqualTo",
            Values: [false]
          },
          {
            FieldName: "dueDate_c",
            Operator: "GreaterThanOrEqualTo",
            Values: [now]
          }
        ],
        orderBy: [{ fieldName: "dueDate_c", sorttype: "ASC" }],
        pagingInfo: { limit, offset: 0 }
      });
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching upcoming activities:", error);
      return [];
    }
  },

  async getOverdue() {
    try {
      const apperClient = getApperClient();
      const now = new Date().toISOString();
      
      const response = await apperClient.fetchRecords('activity_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "subject_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "dueDate_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "createdAt_c"}},
          {"field": {"Name": "contactId_c"}, "referenceField": {"field": {"Name": "Name"}}},
          {"field": {"Name": "dealId_c"}, "referenceField": {"field": {"Name": "title_c"}}}
        ],
        where: [
          {
            FieldName: "completed_c",
            Operator: "EqualTo",
            Values: [false]
          },
          {
            FieldName: "dueDate_c",
            Operator: "LessThan",
            Values: [now]
          }
        ]
      });
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching overdue activities:", error);
      return [];
    }
  },

  getActivityTypes() {
    return [...activityTypes];
  }
};