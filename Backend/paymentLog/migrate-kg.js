const mongoose = require('mongoose');
const studentModel = require('./models/student.model');
const subjectModel = require('./models/subject.model');
const examModel = require('./models/exam.model');
require('dotenv').config();

// Classes that moved under the new 'KG' school level. 'Creche' previously
// belonged to 'Nursery'; the rest are new, so in practice only 'Creche'
// appears in existing data.
const KG_CLASSES = ['Creche', 'Pre-KG', 'KG 1', 'KG 2'];

// Pass --apply to write. Without it the script only reports what it would do.
const apply = process.argv.includes('--apply');

async function migrate() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log(`Connected to MongoDB — mode: ${apply ? 'APPLY' : 'DRY RUN'}\n`);

        const stale = { class: { $in: KG_CLASSES }, schoolType: { $ne: 'KG' } };

        // Students and exams carry a single class, so they can be remapped safely.
        for (const [label, model] of [['students', studentModel], ['exams', examModel]]) {
            const docs = await model.find(stale).select('class schoolType').lean();
            console.log(`${label}: ${docs.length} to reclassify as KG`);
            for (const d of docs) console.log(`  ${d._id}  ${d.schoolType || '(unset)'} / ${d.class}`);
            if (apply && docs.length) {
                const r = await model.updateMany(stale, { $set: { schoolType: 'KG' } });
                console.log(`  -> ${r.modifiedCount} modified`);
            }
        }

        // Subjects hold an array of classes, so a non-KG subject listing a KG
        // class needs a human decision: drop the class, or split out a KG
        // subject. Report only.
        const subjects = await subjectModel
            .find({ classes: { $in: KG_CLASSES }, schoolType: { $ne: 'KG' } })
            .select('name schoolType classes').lean();
        console.log(`\nsubjects: ${subjects.length} need review (not auto-changed)`);
        for (const s of subjects) console.log(`  ${s._id}  ${s.schoolType} / ${s.name} -> [${s.classes.join(', ')}]`);

        if (!apply) console.log('\nDry run only. Re-run with --apply to write.');
    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        await mongoose.disconnect();
        process.exit();
    }
}

migrate();
