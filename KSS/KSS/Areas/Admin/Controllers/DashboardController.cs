﻿using KSS.Areas.Admin.Data;
using KSS.Areas.Admin.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Diagnostics;
using System.Dynamic;
using System.Linq;
using System.Threading.Tasks;

namespace KSS.Areas.Admin.Controllers
{
    [Area("Admin")]
    [Authorize(Roles = "Staff, Admin")]
    public class DashboardController : Controller
    {
        private readonly DataContext _context;

        public int Id { get; set; }

        public DashboardController(DataContext context)
        {
            _context = context;
        }

        [ResponseCache(NoStore = true, Location = ResponseCacheLocation.None)]
        public async Task<IActionResult> Index()
        {
            var user = await _context.Users.FirstOrDefaultAsync(e => e.Email == User.Identity.Name);
            dynamic instances = new ExpandoObject();
            var now = DateTimeOffset.Now.AddHours(-6);
            instances.FutureInstances = _context.Instance
                .Include(i => i.Course)
                .Include(i => i.Location)
                .Where(e => e.StartDate >= now && e.InstructorId == user.UserId)
                .OrderBy(e => e.StartDate);
            instances.GradeInstances = _context.Instance
                .Include(i => i.Course)
                .Include(i => i.Location)
                .Where(e => e.Graded == false && e.StartDate < now && e.InstructorId == user.UserId)
                .OrderBy(e => e.StartDate);
            // get number of future instances, using to display placeholder when there are none.
            int numFutureInstances = 0;
            foreach (var i in instances.FutureInstances){numFutureInstances++;}

            ViewBag.numFutureInstances = numFutureInstances;
            return View(instances);
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}