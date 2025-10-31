import React, { useEffect, useState } from "react";
import { dealsService } from "@/services/api/dealsService";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import Modal from "@/components/molecules/Modal";
import FormField from "@/components/molecules/FormField";

const DealModal = ({ isOpen, onClose, deal, contacts, companies, onDealSaved }) => {
const [formData, setFormData] = useState({
    title_c: "",
    value_c: "",
    stage_c: "Lead",
    contactId_c: "",
    companyId_c: "",
    probability_c: "",
    closeDate_c: "",
    notes_c: ""
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const stages = ["Lead", "Qualified", "Proposal", "Negotiation", "Closed Won", "Closed Lost"];

useEffect(() => {
    if (deal) {
      setFormData({
        title_c: deal.title_c || "",
        value_c: deal.value_c?.toString() || "",
        stage_c: deal.stage_c || "Lead",
        contactId_c: deal.contactId_c?.Id?.toString() || deal.contactId_c?.toString() || "",
        companyId_c: deal.companyId_c?.Id?.toString() || deal.companyId_c?.toString() || "",
        probability_c: deal.probability_c?.toString() || "",
        closeDate_c: deal.closeDate_c ? deal.closeDate_c.split('T')[0] : "",
        notes_c: deal.notes_c || ""
      });
    } else {
      setFormData({
        title_c: "",
        value_c: "",
        stage_c: "Lead",
        contactId_c: "",
        companyId_c: "",
        probability_c: "",
        closeDate_c: "",
        notes_c: ""
      });
    }
    setErrors({});
  }, [deal, isOpen]);

const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title_c.trim()) {
      newErrors.title_c = "Deal title is required";
    }
    if (!formData.value_c || isNaN(formData.value_c) || parseFloat(formData.value_c) <= 0) {
      newErrors.value_c = "Please enter a valid deal value";
    }
    if (!formData.contactId_c) {
      newErrors.contactId_c = "Contact is required";
    }
    if (!formData.companyId_c) {
      newErrors.companyId_c = "Company is required";
    }
    if (!formData.probability_c || isNaN(formData.probability_c) || 
        parseInt(formData.probability_c) < 0 || parseInt(formData.probability_c) > 100) {
      newErrors.probability_c = "Probability must be between 0 and 100";
    }
    if (!formData.closeDate_c) {
      newErrors.closeDate_c = "Expected close date is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
const dealData = {
        title_c: formData.title_c,
        value_c: parseFloat(formData.value_c),
        stage_c: formData.stage_c,
        contactId_c: parseInt(formData.contactId_c),
        companyId_c: parseInt(formData.companyId_c),
        probability_c: parseInt(formData.probability_c),
        closeDate_c: formData.closeDate_c,
        notes_c: formData.notes_c
      };

let savedDeal;
      if (deal) {
        savedDeal = await dealsService.update(deal.Id, dealData);
      } else {
        savedDeal = await dealsService.create(dealData);
      }

      if (savedDeal) {
        onDealSaved(savedDeal);
      }
    } catch (err) {
      console.error("Error saving deal:", err);
      setErrors({ general: "Failed to save deal. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  // Filter contacts based on selected company
const filteredContacts = formData.companyId_c ? 
    contacts.filter(contact => {
      const contactCompanyId = contact.companyId_c?.Id || contact.companyId_c;
      return contactCompanyId === parseInt(formData.companyId_c);
    }) :
    contacts;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={deal ? "Edit Deal" : "Add New Deal"}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {errors.general && (
          <div className="p-3 bg-error-50 border border-error-200 rounded-lg text-error-700 text-sm">
            {errors.general}
          </div>
        )}

<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="Deal Title"
            name="title_c"
            value={formData.title_c}
            onChange={handleChange}
            error={errors.title_c}
            required
            placeholder="Enter deal title"
          />

          <FormField
            label="Deal Value ($)"
            name="value_c"
            type="number"
            value={formData.value_c}
            onChange={handleChange}
            error={errors.value_c}
            required
            placeholder="0"
            min="0"
            step="0.01"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="Stage"
            error={errors.stage_c}
            required
          >
            <Select
              name="stage_c"
              value={formData.stage_c}
              onChange={handleChange}
              error={errors.stage_c}
            >
              {stages.map(stage => (
                <option key={stage} value={stage}>
                  {stage}
                </option>
              ))}
            </Select>
          </FormField>

          <FormField
            label="Probability (%)"
            name="probability_c"
            type="number"
            value={formData.probability_c}
            onChange={handleChange}
            error={errors.probability_c}
            required
            placeholder="0"
            min="0"
            max="100"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="Company"
            error={errors.companyId_c}
            required
          >
            <Select
              name="companyId_c"
              value={formData.companyId_c}
              onChange={handleChange}
              error={errors.companyId_c}
            >
              <option value="">Select a company</option>
              {companies.map(company => (
                <option key={company.Id} value={company.Id}>
                  {company.name_c}
                </option>
              ))}
            </Select>
          </FormField>

          <FormField
            label="Primary Contact"
            error={errors.contactId_c}
            required
          >
            <Select
              name="contactId_c"
              value={formData.contactId_c}
              onChange={handleChange}
              error={errors.contactId_c}
            >
              <option value="">Select a contact</option>
              {filteredContacts.map(contact => (
                <option key={contact.Id} value={contact.Id}>
                  {contact.firstName_c} {contact.lastName_c}
                </option>
              ))}
            </Select>
          </FormField>
        </div>

<FormField
          label="Expected Close Date"
          name="closeDate_c"
          type="date"
          value={formData.closeDate_c}
          onChange={handleChange}
          error={errors.closeDate_c}
          required
        />

<FormField
          label="Notes"
          type="textarea"
          name="notes_c"
          value={formData.notes_c}
          onChange={handleChange}
          placeholder="Additional notes about this deal..."
          error={errors.notes_c}
        />

        <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="btn-gradient"
            disabled={loading}
          >
            {loading ? "Saving..." : deal ? "Update Deal" : "Create Deal"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default DealModal;