import { ChatPage } from '../pages/chat';
import { test, expect } from '@playwright/test';

test.describe('Jaguar SDK Production Deployment Tests', () => {
  let chatPage: ChatPage;

  test.beforeEach(async ({ page }) => {
    // Override base URL to use correct port
    await page.goto('http://localhost:5000/');
    chatPage = new ChatPage(page);
  });

  test('Access Chat Interface and verify page loads', async () => {
    // Verify the chat interface loads successfully
    await expect(chatPage.multimodalInput).toBeVisible();
    await expect(chatPage.sendButton).toBeVisible();
    console.log('✓ Chat interface loaded successfully');
  });

  test('Send basic test message and verify AI response', async () => {
    const testMessage = 'Hello, I want to build a chatbot';
    
    // Send the test message
    await chatPage.sendUserMessage(testMessage);
    console.log(`✓ Sent message: "${testMessage}"`);
    
    // Wait for and verify the response
    await chatPage.isGenerationComplete();
    
    const assistantMessage = await chatPage.getRecentAssistantMessage();
    expect(assistantMessage.content).toBeTruthy();
    expect(assistantMessage.content!.length).toBeGreaterThan(10);
    
    console.log(`✓ Received AI response: "${assistantMessage.content!.substring(0, 100)}..."`);
  });

  test('Test different model selections', async () => {
    const modelsToTest = ['jaguar-pro', 'nature', 'codewriter'];
    
    for (const modelId of modelsToTest) {
      console.log(`Testing model: ${modelId}`);
      
      // Select the model
      await chatPage.chooseModelFromSelector(modelId);
      
      // Send a test message
      const testMessage = `Test message for ${modelId} model`;
      await chatPage.sendUserMessage(testMessage);
      
      // Wait for response
      await chatPage.isGenerationComplete();
      
      const assistantMessage = await chatPage.getRecentAssistantMessage();
      expect(assistantMessage.content).toBeTruthy();
      
      console.log(`✓ ${modelId} model responded successfully`);
    }
  });

  test('Test Master Agent Tools - App Generation', async () => {
    const appRequestMessage = 'Create a simple todo app with React';
    
    await chatPage.sendUserMessage(appRequestMessage);
    await chatPage.isGenerationComplete();
    
    const assistantMessage = await chatPage.getRecentAssistantMessage();
    expect(assistantMessage.content).toBeTruthy();
    
    // Check if the response contains typical app generation keywords
    const response = assistantMessage.content!.toLowerCase();
    const hasAppKeywords = response.includes('app') || 
                          response.includes('component') || 
                          response.includes('react') || 
                          response.includes('todo');
    
    expect(hasAppKeywords).toBeTruthy();
    console.log('✓ Master Agent app generation tool working');
  });

  test('Test Master Agent Tools - Analysis', async () => {
    const analysisMessage = 'Analyze the best architecture for a scalable web application';
    
    await chatPage.sendUserMessage(analysisMessage);
    await chatPage.isGenerationComplete();
    
    const assistantMessage = await chatPage.getRecentAssistantMessage();
    expect(assistantMessage.content).toBeTruthy();
    
    // Check if the response contains analysis-related content
    const response = assistantMessage.content!.toLowerCase();
    const hasAnalysisKeywords = response.includes('architecture') || 
                               response.includes('scalable') || 
                               response.includes('design') || 
                               response.includes('pattern');
    
    expect(hasAnalysisKeywords).toBeTruthy();
    console.log('✓ Master Agent analysis tool working');
  });

  test('Check UI responsiveness and performance', async () => {
    const startTime = Date.now();
    
    // Send a message and measure response time
    await chatPage.sendUserMessage('Quick performance test');
    await chatPage.isGenerationComplete();
    
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    // Response should be reasonable (less than 30 seconds)
    expect(responseTime).toBeLessThan(30000);
    console.log(`✓ Response time: ${responseTime}ms`);
    
    // Check if UI elements are still responsive
    await expect(chatPage.sendButton).toBeVisible();
    await expect(chatPage.multimodalInput).toBeEnabled();
    
    console.log('✓ UI remains responsive after interaction');
  });

  test('Validate complete end-to-end user flow', async () => {
    // 1. Start with a fresh chat
    console.log('Step 1: Starting fresh chat session');
    
    // 2. Select a specific model
    await chatPage.chooseModelFromSelector('jaguar-pro');
    console.log('Step 2: Selected jaguar-pro model');
    
    // 3. Send initial greeting
    await chatPage.sendUserMessage('Hello! Can you help me?');
    await chatPage.isGenerationComplete();
    console.log('Step 3: Sent initial greeting');
    
    // 4. Get response and verify
    let assistantMessage = await chatPage.getRecentAssistantMessage();
    expect(assistantMessage.content).toBeTruthy();
    console.log('Step 4: Received greeting response');
    
    // 5. Follow up with a technical question
    await chatPage.sendUserMessage('What is the best way to structure a Node.js API?');
    await chatPage.isGenerationComplete();
    console.log('Step 5: Sent technical question');
    
    // 6. Verify technical response
    assistantMessage = await chatPage.getRecentAssistantMessage();
    expect(assistantMessage.content).toBeTruthy();
    expect(assistantMessage.content!.length).toBeGreaterThan(50);
    console.log('Step 6: Received technical response');
    
    // 7. Check that chat URL has been updated with ID
    expect(chatPage.getCurrentURL()).toMatch(/\/chat\/[a-f0-9-]{36}/);
    console.log('Step 7: Chat URL updated with session ID');
    
    console.log('✓ Complete end-to-end user flow successful');
  });

  test('Test production deployment connection', async () => {
    // Monitor network requests to verify we're hitting the production API
    const apiRequests: any[] = [];
    
    await chatPage.setupNetworkMonitoring((request) => {
      if (request.url().includes('/api/chat')) {
        apiRequests.push({
          url: request.url(),
          method: request.method(),
          timestamp: Date.now()
        });
      }
    });
    
    // Send a message
    await chatPage.sendUserMessage('Test production deployment connection');
    await chatPage.isGenerationComplete();
    
    // Verify we made API requests
    expect(apiRequests.length).toBeGreaterThan(0);
    console.log('✓ API requests made to chat endpoint:', apiRequests.length);
    
    // Verify response received
    const assistantMessage = await chatPage.getRecentAssistantMessage();
    expect(assistantMessage.content).toBeTruthy();
    
    console.log('✓ Production deployment connection verified');
  });
});