import { logger } from '../utils/logger.js';

const API_BASE = 'http://localhost:5000/api';

const runIntegrationTests = async () => {
  logger.info('🚀 Starting Phase 1 End-to-End API Test Suite...');
  let testsPassed = 0;
  let testsFailed = 0;

  const assert = (condition, testName) => {
    if (condition) {
      logger.info(`  ✅ PASS: ${testName}`);
      testsPassed++;
    } else {
      logger.error(`  ❌ FAIL: ${testName}`);
      testsFailed++;
    }
  };

  try {
    // 1. Health Check
    const healthRes = await fetch(`${API_BASE}/health`);
    const healthJson = await healthRes.json();
    assert(healthRes.status === 200 && healthJson.success === true, 'GET /api/health');

    // 2. Auth: Register New Learner
    const testEmail = `auto.test.${Date.now()}@literacy.org`;
    const registerRes = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Automated Test Learner',
        email: testEmail,
        password: 'Password123!',
        preferredLanguage: 'hi',
        role: 'learner',
        targetSkills: ['reading', 'writing', 'comprehension'],
      }),
    });
    const registerJson = await registerRes.json();
    assert(registerRes.status === 201 && registerJson.data?.accessToken, 'POST /api/auth/register');

    // 3. Auth: Login
    const loginRes = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'learner@literacy.org',
        password: 'Password123!',
      }),
    });
    const loginJson = await loginRes.json();
    assert(loginRes.status === 200 && loginJson.data?.accessToken, 'POST /api/auth/login');
    const token = loginJson.data.accessToken;
    const authHeaders = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
    const seededUserId = loginJson.data.user._id;

    // 4. User: GET /api/users/profile
    const profileRes = await fetch(`${API_BASE}/users/profile`, { headers: authHeaders });
    const profileJson = await profileRes.json();
    assert(profileRes.status === 200 && profileJson.data?.email === 'learner@literacy.org', 'GET /api/users/profile');

    // 5. User: PUT /api/users/profile
    const updateProfileRes = await fetch(`${API_BASE}/users/profile`, {
      method: 'PUT',
      headers: authHeaders,
      body: JSON.stringify({ name: 'Aarav Patel (Verified)', preferredLanguage: 'hi' }),
    });
    const updateProfileJson = await updateProfileRes.json();
    assert(updateProfileRes.status === 200 && updateProfileJson.data?.name === 'Aarav Patel (Verified)', 'PUT /api/users/profile');

    // 6. Curriculum: GET /api/curriculum
    const currListRes = await fetch(`${API_BASE}/curriculum?language=en`);
    const currListJson = await currListRes.json();
    assert(currListRes.status === 200 && Array.isArray(currListJson.data?.curricula), 'GET /api/curriculum (English filter)');
    const sampleCurriculumId = currListJson.data.curricula[0]._id;

    // 7. Curriculum: GET /api/curriculum/:id
    const currDetailRes = await fetch(`${API_BASE}/curriculum/${sampleCurriculumId}`);
    const currDetailJson = await currDetailRes.json();
    assert(currDetailRes.status === 200 && currDetailJson.data?.modules?.length > 0, 'GET /api/curriculum/:id');

    // 8. Content: GET /api/content (with language filter)
    const contentHiRes = await fetch(`${API_BASE}/content?language=hi`);
    const contentHiJson = await contentHiRes.json();
    assert(contentHiRes.status === 200 && contentHiJson.data?.items?.length > 0, 'GET /api/content?language=hi');

    const contentEnRes = await fetch(`${API_BASE}/content?language=en`);
    const contentEnJson = await contentEnRes.json();
    assert(contentEnRes.status === 200 && contentEnJson.data?.items?.length > 0, 'GET /api/content?language=en');
    const sampleContentId = contentEnJson.data.items[0]._id;

    // 9. Content: GET /api/content/:id
    const contentDetailRes = await fetch(`${API_BASE}/content/${sampleContentId}?lang=hi`);
    const contentDetailJson = await contentDetailRes.json();
    assert(contentDetailRes.status === 200 && contentDetailJson.data?.title, 'GET /api/content/:id');

    // 10. Assessments: GET /api/assessments
    const assessListRes = await fetch(`${API_BASE}/assessments?language=en`);
    const assessListJson = await assessListRes.json();
    assert(assessListRes.status === 200 && assessListJson.data?.assessments?.length > 0, 'GET /api/assessments');
    const sampleAssessmentId = assessListJson.data.assessments[0]._id;

    // 11. Assessments: GET /api/assessments/:id
    const assessDetailRes = await fetch(`${API_BASE}/assessments/${sampleAssessmentId}`, { headers: authHeaders });
    const assessDetailJson = await assessDetailRes.json();
    assert(assessDetailRes.status === 200 && assessDetailJson.data?.questions?.length > 0, 'GET /api/assessments/:id');

    // 12. Assessments: POST /api/assessments/submit
    const submitRes = await fetch(`${API_BASE}/assessments/submit`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        assessmentId: sampleAssessmentId,
        timeSpentSeconds: 95,
        answers: [
          { questionId: 'Q-ENG-1', selectedAnswer: 'Bat' },
          { questionId: 'Q-ENG-2', selectedAnswer: 'Umbrella' },
          { questionId: 'Q-ENG-3', selectedAnswer: 'name' },
          { questionId: 'Q-ENG-4', selectedAnswer: 'The sun rises in the morning' },
          { questionId: 'Q-ENG-5', selectedAnswer: 'In Waiting Room A' },
        ],
      }),
    });
    const submitJson = await submitRes.json();
    assert(
      submitRes.status === 200 &&
        submitJson.data?.scores?.overallScore === 100 &&
        submitJson.data?.benchmarkAssigned === 'advanced',
      'POST /api/assessments/submit (Proficiency Benchmarked: 100% -> advanced)'
    );

    // 13. Assessments: GET /api/assessments/benchmark/:userId
    const benchmarkRes = await fetch(`${API_BASE}/assessments/benchmark/${seededUserId}`, { headers: authHeaders });
    const benchmarkJson = await benchmarkRes.json();
    assert(
      benchmarkRes.status === 200 &&
        benchmarkJson.data?.currentProficiencyLevel === 'advanced' &&
        benchmarkJson.data?.latestBenchmark?.overallScore === 100,
      'GET /api/assessments/benchmark/:userId'
    );

    // 14. Phase 2/3/4 Stubs Verification
    const aiStubRes = await fetch(`${API_BASE}/ai/recommendations`);
    const aiStubJson = await aiStubRes.json();
    assert(aiStubRes.status === 200 && aiStubJson.data?.status === 'STUB_PHASE_2', 'GET /api/ai/* (Phase 2 Stub)');

    // 15. Auth: Logout
    const logoutRes = await fetch(`${API_BASE}/auth/logout`, {
      method: 'POST',
      headers: authHeaders,
    });
    const logoutJson = await logoutRes.json();
    assert(logoutRes.status === 200 && logoutJson.success === true, 'POST /api/auth/logout');

    logger.info('---------------------------------------------------------');
    logger.info(`🎉 Integration Test Results: ${testsPassed} PASSED, ${testsFailed} FAILED.`);
    logger.info('---------------------------------------------------------');

    if (testsFailed > 0) {
      process.exit(1);
    } else {
      process.exit(0);
    }
  } catch (error) {
    logger.error('❌ Test runner error:', error);
    process.exit(1);
  }
};

runIntegrationTests();
