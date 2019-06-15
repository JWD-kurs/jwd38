package jwd.wafepa.service;

import org.junit.Before;
import org.junit.Test;

import java.util.List;

import org.junit.Assert;

import jwd.wafepa.model.Activity;
import jwd.wafepa.service.impl.InMemoryActivityService;

public class InMemoryActivityServiceTest {
	private ActivityService activityService;
	
	@Before
	public void setUp() {
		activityService = new InMemoryActivityService();
		
		activityService.save(new Activity("Swimming"));
		activityService.save(new Activity("Running"));
	}
	
	@Test
	public void testFindOne() {
		Activity result = activityService.findOne(2l);
		Assert.assertEquals("Running", result.getName());
	}
	
	@Test
	public void testFindAll() {
		List<Activity> result = activityService.findAll();
		Assert.assertEquals(2, result.size());
	}
}
