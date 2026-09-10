/* CoreLab — operational data shared by the screens.
   Copied from the design project's data.js; exported as a module instead of window.CLData. */
export const D = (() => {
  const techs = [
    { id: 't1', name: 'Tom Okafor', role: 'Field technician II', certs: ['ACI I', 'Nuclear gauge'] },
    { id: 't2', name: 'Priya Natarajan', role: 'Field technician III', certs: ['ACI I', 'ACI II', 'NICET II'] },
    { id: 't3', name: 'Luis Herrera', role: 'Field technician I', certs: ['ACI I'] },
    { id: 't4', name: 'Grace Lindqvist', role: 'Senior inspector', certs: ['ICC Soils', 'ICC Reinforced Concrete'] },
    { id: 't5', name: 'Sam Whitaker', role: 'Lab technician', certs: ['ACI Lab I'] },
  ]
  const projects = [
    { id: '24-0187', name: 'Riverside Interchange', client: 'Meridian DOT', pm: 'Marcus Lee', phase: 'Construction', budget: 412000, used: 0.62, openWo: 12, status: 'Active' },
    { id: '24-0203', name: 'Northgate Warehouse', client: 'Halden Logistics', pm: 'Dana Whitfield', phase: 'Construction', budget: 98000, used: 0.81, openWo: 5, status: 'Active' },
    { id: '24-0166', name: 'Cedar Ridge Phase 2', client: 'Cedar Ridge Partners', pm: 'Marcus Lee', phase: 'Earthwork', budget: 156000, used: 0.34, openWo: 7, status: 'Active' },
    { id: '24-0221', name: 'Lakeview Elementary', client: 'Unified School District 4', pm: 'Aisha Rahman', phase: 'Geotechnical investigation', budget: 64000, used: 0.12, openWo: 3, status: 'Active' },
    { id: '23-0942', name: 'Harbor Street Parking', client: 'City of Fairmont', pm: 'Aisha Rahman', phase: 'Closeout', budget: 71000, used: 0.97, openWo: 0, status: 'Closeout' },
    { id: '24-0148', name: 'Pinecrest Water Tower', client: 'Pinecrest Utilities', pm: 'Dana Whitfield', phase: 'On hold', budget: 120000, used: 0.45, openWo: 0, status: 'On hold' },
  ]
  const workOrders = [
    { id: 'WO-3182', project: '24-0187', test: 'Concrete placement — C31/C143/C231', tech: 't1', day: 0, start: '07:30', hours: 4, status: 'In progress' },
    { id: 'WO-3183', project: '24-0203', test: 'Soil compaction — D6938', tech: 't2', day: 0, start: '08:00', hours: 3, status: 'Dispatched' },
    { id: 'WO-3184', project: '24-0166', test: 'Proctor sampling — D1557', tech: 't3', day: 0, start: '09:00', hours: 2, status: 'Dispatched' },
    { id: 'WO-3185', project: '24-0221', test: 'Boring log — B-07', tech: 't4', day: 0, start: '07:00', hours: 8, status: 'In progress' },
    { id: 'WO-3186', project: '24-0187', test: 'Rebar inspection', tech: 't4', day: 1, start: '08:00', hours: 3, status: 'Scheduled' },
    { id: 'WO-3187', project: '24-0187', test: 'Concrete placement — C31', tech: 't1', day: 1, start: '06:30', hours: 5, status: 'Scheduled' },
    { id: 'WO-3188', project: '24-0203', test: 'Asphalt density — D2950', tech: 't2', day: 2, start: '13:00', hours: 4, status: 'Scheduled' },
    { id: 'WO-3189', project: '24-0166', test: 'Soil compaction — D6938', tech: 't3', day: 2, start: '08:00', hours: 6, status: 'Scheduled' },
    { id: 'WO-3190', project: '24-0221', test: 'Boring log — B-08', tech: 't4', day: 3, start: '07:00', hours: 8, status: 'Scheduled' },
    { id: 'WO-3191', project: '24-0187', test: 'Post-tension inspection', tech: 't2', day: 4, start: '09:00', hours: 3, status: 'Scheduled' },
    { id: 'WO-3192', project: '24-0203', test: 'Floor flatness — E1155', tech: null, day: 1, start: '10:00', hours: 3, status: 'Unassigned' },
    { id: 'WO-3193', project: '24-0166', test: 'Concrete placement — C31', tech: null, day: 3, start: '07:00', hours: 4, status: 'Unassigned' },
    { id: 'WO-3194', project: '24-0187', test: 'Masonry prism sampling', tech: null, day: 4, start: '08:00', hours: 2, status: 'Unassigned' },
  ]
  const samples = [
    { id: 'S-0412', project: '24-0187', material: 'Concrete cylinder', test: 'ASTM C39', set: 'A', cast: 'Aug 17', due: 'Sep 14', age: 28, tech: 't5', status: 'Due today', result: null },
    { id: 'S-0413', project: '24-0187', material: 'Concrete cylinder', test: 'ASTM C39', set: 'A', cast: 'Aug 17', due: 'Sep 14', age: 28, tech: 't5', status: 'Due today', result: null },
    { id: 'S-0414', project: '24-0187', material: 'Concrete cylinder', test: 'ASTM C39', set: 'A', cast: 'Aug 17', due: 'Sep 14', age: 28, tech: 't5', status: 'Due today', result: null },
    { id: 'S-0418', project: '24-0203', material: 'Soil — bulk', test: 'ASTM D1557', set: '—', cast: 'Sep 09', due: 'Sep 14', age: 5, tech: 't5', status: 'In test', result: null },
    { id: 'S-0421', project: '24-0166', material: 'Soil — bulk', test: 'AASHTO T99', set: '—', cast: 'Sep 08', due: 'Sep 15', age: 6, tech: null, status: 'Received', result: null },
    { id: 'S-0399', project: '24-0187', material: 'Concrete cylinder', test: 'ASTM C39', set: 'B', cast: 'Aug 10', due: 'Sep 07', age: 28, tech: 't5', status: 'Tested', result: { strength: 4120, pass: true } },
    { id: 'S-0400', project: '24-0187', material: 'Concrete cylinder', test: 'ASTM C39', set: 'B', cast: 'Aug 10', due: 'Sep 07', age: 28, tech: 't5', status: 'Tested', result: { strength: 3880, pass: true } },
    { id: 'S-0388', project: '24-0203', material: 'Grout cube', test: 'ASTM C1019', set: 'C', cast: 'Aug 12', due: 'Sep 09', age: 28, tech: 't5', status: 'Tested', result: { strength: 1960, pass: false } },
    { id: 'S-0425', project: '24-0221', material: 'Soil — SPT', test: 'ASTM D2216', set: '—', cast: 'Sep 11', due: 'Sep 16', age: 3, tech: null, status: 'Received', result: null },
    { id: 'S-0426', project: '24-0221', material: 'Soil — SPT', test: 'ASTM D4318', set: '—', cast: 'Sep 11', due: 'Sep 18', age: 3, tech: null, status: 'Received', result: null },
  ]
  const reports = [
    { id: '24-0187-R04', project: '24-0187', title: 'Compressive strength — set B (28-day)', type: 'Lab', author: 't5', submitted: 'Sep 13, 4:12 PM', status: 'Pending review', pages: 3 },
    { id: '24-0203-R11', project: '24-0203', title: 'Field density — building pad, lifts 4–6', type: 'Field', author: 't2', submitted: 'Sep 13, 5:40 PM', status: 'Pending review', pages: 2 },
    { id: '24-0166-R02', project: '24-0166', title: 'Proctor — borrow source 2', type: 'Lab', author: 't5', submitted: 'Sep 12, 11:05 AM', status: 'Pending review', pages: 2 },
    { id: '24-0221-B07', project: '24-0221', title: 'Boring log B-07', type: 'Geotech', author: 't4', submitted: 'Sep 12, 6:22 PM', status: 'Pending review', pages: 4 },
    { id: '24-0187-R03', project: '24-0187', title: 'Concrete placement — pier cap 3', type: 'Field', author: 't1', submitted: 'Sep 11, 3:15 PM', status: 'Approved', pages: 2 },
    { id: '24-0203-R10', project: '24-0203', title: 'Grout cube strength — set C', type: 'Lab', author: 't5', submitted: 'Sep 10, 9:48 AM', status: 'Delivered', pages: 2 },
    { id: '24-0187-R02', project: '24-0187', title: 'Rebar inspection — pier cap 3', type: 'Field', author: 't4', submitted: 'Sep 09, 2:00 PM', status: 'Delivered', pages: 1 },
  ]
  const timeEntries = [
    { id: 'TE-9021', tech: 't1', date: 'Sep 14', project: '24-0187', task: 'Concrete placement', hours: 4.0, rate: 92, status: 'Unbilled' },
    { id: 'TE-9022', tech: 't2', date: 'Sep 14', project: '24-0203', task: 'Soil compaction', hours: 3.5, rate: 98, status: 'Unbilled' },
    { id: 'TE-9023', tech: 't3', date: 'Sep 14', project: '24-0166', task: 'Proctor sampling', hours: 2.0, rate: 78, status: 'Unbilled' },
    { id: 'TE-9024', tech: 't4', date: 'Sep 14', project: '24-0221', task: 'Boring log B-07', hours: 8.0, rate: 118, status: 'Unbilled' },
    { id: 'TE-9018', tech: 't1', date: 'Sep 13', project: '24-0187', task: 'Concrete placement', hours: 5.0, rate: 92, status: 'Unbilled' },
    { id: 'TE-9019', tech: 't5', date: 'Sep 13', project: '24-0187', task: 'Cylinder breaks', hours: 1.5, rate: 84, status: 'Unbilled' },
    { id: 'TE-9010', tech: 't2', date: 'Sep 12', project: '24-0203', task: 'Asphalt density', hours: 4.0, rate: 98, status: 'Approved' },
    { id: 'TE-9006', tech: 't4', date: 'Sep 11', project: '24-0187', task: 'Rebar inspection', hours: 3.0, rate: 118, status: 'Invoiced' },
  ]
  const invoices = [
    { id: 'INV-2044', project: '24-0187', client: 'Meridian DOT', issued: 'Sep 08', due: 'Oct 08', amount: 18420, status: 'Sent' },
    { id: 'INV-2043', project: '24-0203', client: 'Halden Logistics', issued: 'Sep 05', due: 'Oct 05', amount: 6215, status: 'Sent' },
    { id: 'INV-2041', project: '23-0942', client: 'City of Fairmont', issued: 'Aug 06', due: 'Sep 05', amount: 4980, status: 'Overdue' },
    { id: 'INV-2039', project: '24-0166', client: 'Cedar Ridge Partners', issued: 'Aug 01', due: 'Aug 31', amount: 9330, status: 'Paid' },
  ]
  const equipment = [
    { id: 'CM-02', type: 'Compression machine', model: 'Forney F-500', serial: 'F5-21938', last: 'Sep 18, 2025', next: 'Sep 18', status: 'Due in 4 days' },
    { id: 'NG-04', type: 'Nuclear density gauge', model: 'Troxler 3440', serial: 'T3-77041', last: 'Mar 02', next: 'Mar 02, 2027', status: 'Current' },
    { id: 'NG-05', type: 'Nuclear density gauge', model: 'Troxler 3440', serial: 'T3-77102', last: 'Aug 22, 2025', next: 'Aug 22', status: 'Overdue' },
    { id: 'OV-01', type: 'Drying oven', model: 'Humboldt H-30140', serial: 'H3-1120', last: 'Jun 14', next: 'Jun 14, 2027', status: 'Current' },
    { id: 'SL-03', type: 'Slump cone set', model: 'Gilson HM-73', serial: '—', last: 'Jul 01', next: 'Jan 01, 2027', status: 'Current' },
    { id: 'TH-11', type: 'Concrete thermometer', model: 'Traceable 4052', serial: 'TR-4052-11', last: 'Sep 01', next: 'Sep 01, 2027', status: 'Current' },
    { id: 'AM-02', type: 'Air meter (pressure)', model: 'Humboldt H-2783', serial: 'H2-5580', last: 'May 20', next: 'Nov 20', status: 'Current' },
    { id: 'SC-01', type: 'Balance 30 kg', model: 'Ohaus Ranger 7000', serial: 'OR-33019', last: 'Feb 11', next: 'Feb 11, 2027', status: 'Current' },
  ]
  const certifications = [
    { id: 'c1', tech: 't1', cert: 'ACI Concrete Field Testing Technician — Grade I', issuer: 'ACI', expires: 'Nov 30', status: 'Expiring soon' },
    { id: 'c2', tech: 't1', cert: 'Nuclear Gauge Safety & HAZMAT', issuer: 'Troxler', expires: 'Mar 15, 2028', status: 'Current' },
    { id: 'c3', tech: 't2', cert: 'ACI Concrete Strength Testing Technician', issuer: 'ACI', expires: 'Jun 30, 2029', status: 'Current' },
    { id: 'c4', tech: 't2', cert: 'NICET Level II — Construction Materials Testing', issuer: 'NICET', expires: 'Jan 31, 2028', status: 'Current' },
    { id: 'c5', tech: 't3', cert: 'ACI Concrete Field Testing Technician — Grade I', issuer: 'ACI', expires: 'Sep 30', status: 'Expiring soon' },
    { id: 'c6', tech: 't4', cert: 'ICC Soils Special Inspector', issuer: 'ICC', expires: 'Aug 15', status: 'Expired' },
    { id: 'c7', tech: 't4', cert: 'ICC Reinforced Concrete Special Inspector', issuer: 'ICC', expires: 'Apr 30, 2028', status: 'Current' },
    { id: 'c8', tech: 't5', cert: 'ACI Laboratory Testing Technician — Level 1', issuer: 'ACI', expires: 'Dec 31, 2028', status: 'Current' },
  ]
  const byId = (list) => Object.fromEntries(list.map((x) => [x.id, x]))
  return { techs, projects, workOrders, samples, reports, timeEntries, invoices, equipment, certifications, tech: byId(techs), project: byId(projects), days: ['Mon 14', 'Tue 15', 'Wed 16', 'Thu 17', 'Fri 18'] }
})()
