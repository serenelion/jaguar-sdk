import { test, expect } from '@playwright/test';
import { ChatPage } from '../pages/chat';

test.describe('Master Agent Tools', () => {
  let chatPage: ChatPage;

  test.beforeEach(async ({ page }) => {
    chatPage = new ChatPage(page);
    await chatPage.goto();
  });

  test('should detect and analyze chat agent request', async ({ page }) => {
    // Test chat agent creation request
    const message = "I want to build a chatbot for customer service";
    
    await chatPage.sendMessage(message);
    
    // Wait for response
    await page.waitForTimeout(10000);
    
    // Check if analyzeAppRequest tool was triggered
    const messages = await chatPage.getMessages();
    const lastMessage = messages[messages.length - 1];
    
    // Look for analysis indicators
    expect(lastMessage).toContain('Analyzing');
    
    // Check for app type detection
    expect(lastMessage.toLowerCase()).toMatch(/chat.?agent|conversational|assistant/);
  });

  test('should detect and analyze automation agent request', async ({ page }) => {
    const message = "Create an automation agent for email management";
    
    await chatPage.sendMessage(message);
    
    // Wait for response
    await page.waitForTimeout(10000);
    
    const messages = await chatPage.getMessages();
    const lastMessage = messages[messages.length - 1];
    
    // Look for automation agent detection
    expect(lastMessage.toLowerCase()).toMatch(/automation.?agent|workflow|automate/);
  });

  test('should detect and analyze React app request', async ({ page }) => {
    const message = "Build a React app for project management";
    
    await chatPage.sendMessage(message);
    
    // Wait for response  
    await page.waitForTimeout(10000);
    
    const messages = await chatPage.getMessages();
    const lastMessage = messages[messages.length - 1];
    
    // Look for React app detection
    expect(lastMessage.toLowerCase()).toMatch(/react.?app|web.?app|application/);
  });

  test('should detect and analyze spatial network tool request', async ({ page }) => {
    const message = "Make a spatial network tool for community mapping";
    
    await chatPage.sendMessage(message);
    
    // Wait for response
    await page.waitForTimeout(10000);
    
    const messages = await chatPage.getMessages();
    const lastMessage = messages[messages.length - 1];
    
    // Look for spatial network tool detection
    expect(lastMessage.toLowerCase()).toMatch(/spatial.?network|community|mapping/);
  });

  test('should generate complete application with createApp tool', async ({ page }) => {
    const message = "I want to build a chatbot for customer service that can handle refunds and order tracking";
    
    await chatPage.sendMessage(message);
    
    // Wait for analysis and generation
    await page.waitForTimeout(15000);
    
    const messages = await chatPage.getMessages();
    const responses = messages.filter((_, index) => index % 2 === 1); // Get AI responses only
    const fullResponse = responses.join(' ');
    
    // Check for analyzeAppRequest indicators
    expect(fullResponse).toMatch(/analyz|request|type/i);
    
    // Check for createApp indicators
    expect(fullResponse).toMatch(/creat|generat|app/i);
    
    // Check for system prompt generation
    expect(fullResponse).toMatch(/system.?prompt|instruction|behavior/i);
    
    // Check for code generation
    expect(fullResponse).toMatch(/code|component|function|class/i);
  });

  test('should provide proper app configuration and deployment info', async ({ page }) => {
    const message = "Create a React dashboard for tracking environmental sustainability metrics";
    
    await chatPage.sendMessage(message);
    
    // Wait for complete generation
    await page.waitForTimeout(20000);
    
    const messages = await chatPage.getMessages();
    const fullResponse = messages.join(' ');
    
    // Check for configuration details
    expect(fullResponse).toMatch(/config|setup|deploy/i);
    
    // Check for capabilities listing
    expect(fullResponse).toMatch(/capabilit|feature|function/i);
    
    // Check for integration suggestions
    expect(fullResponse).toMatch(/integrat|api|service/i);
  });

  test('should handle complex multi-capability app requests', async ({ page }) => {
    const message = "Build an AI assistant that can manage my calendar, send emails, track project progress, and provide data analytics dashboards";
    
    await chatPage.sendMessage(message);
    
    // Wait for analysis of complex request
    await page.waitForTimeout(20000);
    
    const messages = await chatPage.getMessages();
    const fullResponse = messages.join(' ');
    
    // Should detect multiple capabilities
    expect(fullResponse).toMatch(/calendar|email|project|analytics/i);
    
    // Should suggest appropriate app type (likely automation-agent or react-app)
    expect(fullResponse).toMatch(/automation|react|application/i);
    
    // Should break down capabilities
    expect(fullResponse).toMatch(/multiple|several|various|capabilit/i);
  });
});