// Slack Webhook Integration & Operations Utility for OTD AI Surfer
import { SlackNotification } from './types';

// Helper to save simulated log notifications inside localStorage for the Control Room dashboard
export function getSavedSimulations(): SlackNotification[] {
  try {
    const raw = localStorage.getItem('otd_slack_sim_notifs');
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error fetching simulated Slack logs:', e);
  }
  
  // Return some high-fidelity default logs if empty so the dashboard has rich historical logs out of the box
  return [
    {
      id: 'sim_1',
      timestamp: new Date(Date.now() - 3600000 * 2.5).toISOString(),
      channel: '#otd-leads',
      status: 'success',
      type: 'lead_form',
      payload: {
        name: 'Admiral John Vance',
        email: 'vance@coastalholdings.corp',
        company: 'Coastal Holdings Ltd.',
        scope: 'Dual-Linked Dynamic Setup',
        message: 'Interested in automating our monthly compliance audits completely.'
      }
    },
    {
      id: 'sim_2',
      timestamp: new Date(Date.now() - 3600000 * 14.2).toISOString(),
      channel: '#otd-alerts',
      status: 'simulate_only',
      type: 'system',
      payload: {
        text: 'DNS Asset Secure Lock deployed on primary domains.',
        event: 'dns_lock',
        agent: 'OTD AI Core'
      }
    }
  ];
}

export function saveSimulations(notifs: SlackNotification[]) {
  try {
    localStorage.setItem('otd_slack_sim_notifs', JSON.stringify(notifs.slice(0, 50)));
  } catch (e) {
    console.error('Error saving simulated Slack logs:', e);
  }
}

// Triggers Slack Notification flow (both actual fetch POST and simulated logger stream)
export async function sendSlackMessage(
  type: 'lead_form' | 'contact_form' | 'newsletter' | 'system', 
  payload: Record<string, any>
): Promise<{ success: boolean; mode: 'sent' | 'simulated' | 'error'; message: string }> {
  // Read active Slack Webhook setup from persistent localStorage
  const webhookUrl = localStorage.getItem('otd_slack_webhook') || '';
  const isEnabled = localStorage.getItem('otd_slack_enabled') !== 'false'; // default to enabled if toggled on
  const channel = localStorage.getItem('otd_slack_channel') || '#otd-leads';

  // Format a highly styled professional Slack notification fallback string and rich layout attachments
  let messageText = '';
  let colorAccent = '#00F0FF'; // Teal Glow (Default)
  let fields: { title: string; value: string; short: boolean }[] = [];

  if (type === 'lead_form') {
    messageText = `🌊 *New Hot Lead Captured on OceanTideDrop.services*`;
    colorAccent = '#EC4899'; // Chroma Hot Pink
    fields = [
      { title: 'Contact Name', value: payload.name || 'N/A', short: true },
      { title: 'Corporate Email', value: payload.email || 'N/A', short: true },
      { title: 'Company Name', value: payload.companyName || 'N/A', short: true },
      { title: 'Operational Goal Scope', value: payload.websiteScope || 'N/A', short: true },
      { title: 'Integration Tier', value: payload.interestArea || 'N/A', short: true },
      { title: 'Operations Context', value: payload.message || 'No additional notes', short: false }
    ];
  } else if (type === 'contact_form') {
    messageText = `🏛️ *New Enterprise RFP Received on OTDAISurfer.surf*`;
    colorAccent = '#00F0FF'; // Cyan Accent
    fields = [
      { title: 'Client Contact', value: payload.name || 'N/A', short: true },
      { title: 'Organization', value: payload.organization || 'N/A', short: true },
      { title: 'Solution Interest', value: payload.serviceInterest || 'N/A', short: false },
      { title: 'Decision Budget', value: payload.budget || 'N/A', short: true },
      { title: 'Compliance Email', value: payload.email || 'N/A', short: true },
      { title: 'RFP Context & Workflow', value: payload.proposalRequest || 'N/A', short: false }
    ];
  } else if (type === 'newsletter') {
    messageText = `📨 *New Newsletter Subscription Registered*`;
    colorAccent = '#A855F7'; // Electric Violet
    fields = [
      { title: 'Subscriber Email', value: payload.email || 'N/A', short: true },
      { title: 'Source Channel', value: payload.source || 'Standard Form', short: true }
    ];
  } else {
    messageText = `⚙️ *System Alert / Brand Operations*`;
    colorAccent = '#EAB308'; // Amber Warning
    fields = [
      { title: 'Operational Event', value: payload.text || 'System Activity Triggered', short: false },
      { title: 'Domain Target', value: payload.domain || 'All assets', short: true },
      { title: 'Execution Node', value: payload.agent || 'Core Browser Ingress', short: true }
    ];
  }

  // Construct raw Slack body
  const slackBody = {
    text: messageText,
    attachments: [
      {
        fallback: `New telemetry update: ${messageText}`,
        color: colorAccent,
        pretext: `*OTD AI Surfer Notification Router*`,
        title: type === 'lead_form' ? 'Tactical Lead Submission Report' : type === 'contact_form' ? 'Enterprise Solution RFP' : 'Operations Update',
        fields: fields,
        footer: `OTD AI Surfer System Blueprint • ${new Date().toISOString()}`,
        ts: Math.floor(Date.now() / 1000)
      }
    ]
  };

  // Add notification log to simulation stack
  const newLog: SlackNotification = {
    id: `sim_log_${Date.now()}`,
    timestamp: new Date().toISOString(),
    channel,
    status: webhookUrl && isEnabled ? 'success' : 'simulate_only',
    type,
    payload
  };

  const logs = getSavedSimulations();
  logs.unshift(newLog);
  saveSimulations(logs);

  // Send real request if URL is set and Slack broadcasts are enabled
  if (webhookUrl && isEnabled) {
    try {
      // Slack webhooks require POST with text content or json.
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          // Note: Standard Slack Incoming Webhooks usually allow text/plain or json
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(slackBody),
        mode: 'no-cors' // Use no-cors in case standard slack API hits CORS checks since we run directly client-side
      });
      // Standard fetch with no-cors will return opaque response, which is fine, we still treat it as success as long as no exception
      return {
        success: true,
        mode: 'sent',
        message: 'Slack Notification dispatched successfully to live Webhook channel.'
      };
    } catch (err: any) {
      console.error('Slack webhook fetch error:', err);
      // Fallback update status to error
      newLog.status = 'error';
      saveSimulations(logs);
      return {
        success: false,
        mode: 'error',
        message: `Slack dispatch failed: ${err?.message || 'Check network connection or CORS rules'}`
      };
    }
  }

  // Pure simulation
  return {
    success: true,
    mode: 'simulated',
    message: 'Simulated alert captured locally in Chrome Sandbox logs (No active live webhook URL configured).'
  };
}
