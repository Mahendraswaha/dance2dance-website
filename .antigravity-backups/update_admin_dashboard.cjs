const fs = require('fs');

let content = fs.readFileSync('src/pages/AdminDashboard.jsx', 'utf8');

const oldHandleSubmit = `    try {
      const primaryTitle = (formData[\`title_\${activeLangTab}\`] || formData.title_no || formData.title_en || formData.title_pt || '').trim();
      const primarySchedule = (formData[\`scheduleDetails_\${activeLangTab}\`] || formData.scheduleDetails_no || formData.scheduleDetails_en || formData.scheduleDetails_pt || '').trim();
      const primaryLocation = (formData[\`location_\${activeLangTab}\`] || formData.location_no || formData.location_en || formData.location_pt || '').trim();

      const payload = {
        category: formData.category || 'bethedance',
        instructor: (formData.instructor || 'Safia').trim(),
        instructorEmail: (formData.instructorEmail || '').trim(),
        startDate: formData.startDate,
        startTime: formData.startTime || '',
        endTime: formData.endTime || '',
        totalHours: formData.totalHours ? Number(formData.totalHours) : null,
        totalSpots: Number(formData.totalSpots),

        title_no: (formData.title_no || primaryTitle).trim(),
        title_en: (formData.title_en || primaryTitle).trim(),
        title_pt: (formData.title_pt || primaryTitle).trim(),

        scheduleDetails_no: (formData.scheduleDetails_no || primarySchedule).trim(),
        scheduleDetails_en: (formData.scheduleDetails_en || primarySchedule).trim(),
        scheduleDetails_pt: (formData.scheduleDetails_pt || primarySchedule).trim(),

        location_no: (formData.location_no || primaryLocation).trim(),
        location_en: (formData.location_en || primaryLocation).trim(),
        location_pt: (formData.location_pt || primaryLocation).trim(),

        // Backward compatibility
        title: (formData.title_en || primaryTitle).trim(),
        scheduleDetails: (formData.scheduleDetails_en || primarySchedule).trim(),
        location: (formData.location_en || primaryLocation).trim()
      };`;

const newHandleSubmit = `    try {
      const primaryTitle = (formData[\`title_\${activeLangTab}\`] || formData.title_no || formData.title_en || formData.title_pt || '').trim();
      const primarySchedule = (formData[\`scheduleDetails_\${activeLangTab}\`] || formData.scheduleDetails_no || formData.scheduleDetails_en || formData.scheduleDetails_pt || '').trim();
      const primaryLocation = (formData[\`location_\${activeLangTab}\`] || formData.location_no || formData.location_en || formData.location_pt || '').trim();

      const payload = {
        category: formData.category || 'bethedance',
        instructor: (formData.instructor || 'Safia').trim(),
        instructorEmail: (formData.instructorEmail || '').trim(),
        startDate: formData.startDate,
        startTime: formData.startTime || '',
        endTime: formData.endTime || '',
        totalHours: formData.totalHours ? Number(formData.totalHours) : null,
        totalSpots: Number(formData.totalSpots),

        title_no: primaryTitle,
        title_en: primaryTitle,
        title_pt: primaryTitle,

        scheduleDetails_no: primarySchedule,
        scheduleDetails_en: primarySchedule,
        scheduleDetails_pt: primarySchedule,

        location_no: primaryLocation,
        location_en: primaryLocation,
        location_pt: primaryLocation,

        // Backward compatibility
        title: primaryTitle,
        scheduleDetails: primarySchedule,
        location: primaryLocation
      };`;

content = content.replace(oldHandleSubmit, newHandleSubmit);
fs.writeFileSync('src/pages/AdminDashboard.jsx', content, 'utf8');
console.log('AdminDashboard updated');
