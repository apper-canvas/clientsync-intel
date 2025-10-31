import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";

export const contactsService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords('contact_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "firstName_c"}},
          {"field": {"Name": "lastName_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "createdAt_c"}},
          {"field": {"Name": "updatedAt_c"}},
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
      console.error("Error fetching contacts:", error);
      toast.error("Failed to load contacts");
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.getRecordById('contact_c', parseInt(id), {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "firstName_c"}},
          {"field": {"Name": "lastName_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "createdAt_c"}},
          {"field": {"Name": "updatedAt_c"}},
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
      console.error(`Error fetching contact ${id}:`, error);
      toast.error("Failed to load contact");
      return null;
    }
  },

  async create(contactData) {
    try {
      const apperClient = getApperClient();
      const params = {
        records: [{
          firstName_c: contactData.firstName_c,
          lastName_c: contactData.lastName_c,
          email_c: contactData.email_c,
          phone_c: contactData.phone_c,
          title_c: contactData.title_c,
          notes_c: contactData.notes_c || "",
          companyId_c: parseInt(contactData.companyId_c),
          createdAt_c: new Date().toISOString(),
          updatedAt_c: new Date().toISOString()
        }]
      };
      
      const response = await apperClient.createRecord('contact_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to create contact:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          return null;
        }
        return response.results[0].data;
      }
      
      return null;
    } catch (error) {
      console.error("Error creating contact:", error);
      toast.error("Failed to create contact");
      return null;
    }
  },

  async update(id, contactData) {
    try {
      const apperClient = getApperClient();
      const params = {
        records: [{
          Id: parseInt(id),
          firstName_c: contactData.firstName_c,
          lastName_c: contactData.lastName_c,
          email_c: contactData.email_c,
          phone_c: contactData.phone_c,
          title_c: contactData.title_c,
          notes_c: contactData.notes_c || "",
          companyId_c: parseInt(contactData.companyId_c),
          updatedAt_c: new Date().toISOString()
        }]
      };
      
      const response = await apperClient.updateRecord('contact_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to update contact:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          return null;
        }
        return response.results[0].data;
      }
      
      return null;
    } catch (error) {
      console.error("Error updating contact:", error);
      toast.error("Failed to update contact");
      return null;
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient();
      const params = { RecordIds: [parseInt(id)] };
      
      const response = await apperClient.deleteRecord('contact_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }
      
      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to delete contact:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          return false;
        }
      }
      
      return true;
    } catch (error) {
      console.error("Error deleting contact:", error);
      toast.error("Failed to delete contact");
      return false;
    }
  },

  async searchContacts(query) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords('contact_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "firstName_c"}},
          {"field": {"Name": "lastName_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "createdAt_c"}},
          {"field": {"Name": "updatedAt_c"}},
          {"field": {"Name": "companyId_c"}, "referenceField": {"field": {"Name": "name_c"}}}
        ],
        whereGroups: query ? [{
          operator: "OR",
          subGroups: [
            {
              conditions: [
                {
                  fieldName: "firstName_c",
                  operator: "Contains",
                  values: [query]
                },
                {
                  fieldName: "lastName_c",
                  operator: "Contains",
                  values: [query]
                },
                {
                  fieldName: "email_c",
                  operator: "Contains",
                  values: [query]
                },
                {
                  fieldName: "title_c",
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
      console.error("Error searching contacts:", error);
      return [];
    }
  },

  async bulkUpdate(contactIds, updateData) {
    try {
      const apperClient = getApperClient();
      const records = contactIds.map(id => ({
        Id: parseInt(id),
        ...updateData,
        updatedAt_c: new Date().toISOString()
      }));
      
      const response = await apperClient.updateRecord('contact_c', { records });
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return { updated: [], errors: [], successCount: 0, errorCount: contactIds.length };
      }
      
      const successful = response.results?.filter(r => r.success) || [];
      const failed = response.results?.filter(r => !r.success) || [];
      
      if (failed.length > 0) {
        console.error(`Failed to update ${failed.length} contacts:`, failed);
        failed.forEach(record => {
          if (record.message) toast.error(record.message);
        });
      }
      
      return {
        updated: successful.map(r => r.data),
        errors: failed,
        successCount: successful.length,
        errorCount: failed.length
      };
    } catch (error) {
      console.error("Error bulk updating contacts:", error);
      toast.error("Failed to update contacts");
      return { updated: [], errors: [], successCount: 0, errorCount: contactIds.length };
    }
  },

  async bulkDelete(contactIds) {
    try {
      const apperClient = getApperClient();
      const params = { RecordIds: contactIds.map(id => parseInt(id)) };
      
      const response = await apperClient.deleteRecord('contact_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return { deleted: [], errors: [], successCount: 0, errorCount: contactIds.length };
      }
      
      const successful = response.results?.filter(r => r.success) || [];
      const failed = response.results?.filter(r => !r.success) || [];
      
      if (failed.length > 0) {
        console.error(`Failed to delete ${failed.length} contacts:`, failed);
        failed.forEach(record => {
          if (record.message) toast.error(record.message);
        });
      }
      
      return {
        deleted: successful,
        errors: failed,
        successCount: successful.length,
        errorCount: failed.length
      };
    } catch (error) {
      console.error("Error bulk deleting contacts:", error);
      toast.error("Failed to delete contacts");
      return { deleted: [], errors: [], successCount: 0, errorCount: contactIds.length };
    }
  },

  async bulkExport(contactsData) {
    try {
      const headers = [
        'ID', 'First Name', 'Last Name', 'Email', 'Phone', 
        'Title', 'Company', 'Created At', 'Updated At'
      ];
      
      const csvRows = [
        headers.join(','),
        ...contactsData.map(contact => [
          contact.Id,
          `"${contact.firstName_c || ''}"`,
          `"${contact.lastName_c || ''}"`,
          `"${contact.email_c || ''}"`,
          `"${contact.phone_c || ''}"`,
          `"${contact.title_c || ''}"`,
          `"${contact.companyId_c?.Name || ''}"`,
          `"${contact.createdAt_c || ''}"`,
          `"${contact.updatedAt_c || ''}"`
        ].join(','))
      ];
      
      const csvContent = csvRows.join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `contacts_export_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      return {
        success: true,
        filename: `contacts_export_${new Date().toISOString().split('T')[0]}.csv`,
        count: contactsData.length
      };
    } catch (error) {
      console.error("Error exporting contacts:", error);
      toast.error("Failed to export contacts");
      return { success: false, filename: '', count: 0 };
    }
  }
};