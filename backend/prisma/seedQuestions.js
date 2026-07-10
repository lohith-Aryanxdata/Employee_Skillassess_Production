const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const questions = [
  {
    questionText: "What is the primary difference between a Row Context created by an iterator (like SUMX) and a Row Context created by a Calculated Column?",
    optionA: "Iterators provide context transition, while calculated columns do not.",
    optionB: "Calculated columns provide context transition, while iterators do not.",
    optionC: "They are identical in functionality.",
    optionD: "Only iterators can be used in measures.",
    correctAnswer: "A",
    topic: "DAX - Intermediate"
  },
  {
    questionText: "When does \"Context Transition\" occur automatically?",
    optionA: "Whenever a measure is called inside an iterator or via CALCULATE.",
    optionB: "Only when using FILTER",
    optionC: "Only when using ALL.",
    optionD: "Never, it must be invoked manually.",
    correctAnswer: "A",
    topic: "DAX - Intermediate"
  },
  {
    questionText: "Why does a \"Many-to-Many\" relationship with bi-directional cross-filtering pose a risk to model performance?",
    optionA: "It triggers iterative cross-filtering that can lead to circular dependencies and performance degradation.",
    optionB: "It increases the file size significantly.",
    optionC: "It prevents the use of DAX measures.",
    optionD: "It disables the ability to use CALCULATE.",
    correctAnswer: "A",
    topic: "Advanced Concepts (Optimization)"
  },
  {
    questionText: "What is the fundamental advantage of \"Direct Lake\" mode in Fabric?",
    optionA: "It provides the performance of Import mode by reading Parquet files directly from OneLake without moving data.",
    optionB: "It is faster than DirectQuery but slower than Import.",
    optionC: "It automatically generates DAX for the user.",
    optionD: "It eliminates the need for a workspace.",
    correctAnswer: "A",
    topic: "Microsoft Fabric"
  },
  {
    questionText: "Which DAX function is most recommended to safely handle division by zero errors?",
    optionA: "DIVIDE()",
    optionB: "IF(ISERROR())",
    optionC: "IF(ISBLANK())",
    optionD: "COALESCE()",
    correctAnswer: "A",
    topic: "Advanced Concepts (Optimization)"
  },
  {
    questionText: "What does KEEPFILTERS do within a CALCULATE expression?",
    optionA: "It modifies the filter context by intersecting the new filter with existing ones instead of replacing them.",
    optionB: "It deletes all existing filters.",
    optionC: "It keeps only the last filter applied.",
    optionD: "It disables row-level security.",
    correctAnswer: "A",
    topic: "DAX - Intermediate"
  },
  {
    questionText: "What is the most memory-efficient way to handle high-cardinality columns in a model?",
    optionA: "Remove them if not needed, or split them into separate tables.",
    optionB: "Change the data type to Text.",
    optionC: "Use a Calculated Column.",
    optionD: "Keep them in the Fact table.",
    correctAnswer: "A",
    topic: "Advanced Concepts (Optimization)"
  },
  {
    questionText: "In the \"App Owns Data\" model, how do you dynamically apply Row-Level Security (RLS) for a user who does not have a Power BI license?",
    optionA: "By passing an EffectiveIdentity object containing the username and roles in the Embed Token.",
    optionB: "By creating a unique workspace for every user.",
    optionC: "By using a public link.",
    optionD: "RLS is not supported in \"App Owns Data.\"",
    correctAnswer: "A",
    topic: "Power BI Embedded"
  },
  {
    questionText: "What is the primary purpose of an \"Aggregate Table\" in a DirectQuery model?",
    optionA: "To store pre-calculated, smaller summaries that are queried instead of the large detail table when possible.",
    optionB: "To backup the database.",
    optionC: "To handle many-to-many relationships.",
    optionD: "To format the data for the visual.",
    correctAnswer: "A",
    topic: "Advanced Concepts (Optimization)"
  },
  {
    questionText: "What is the role of the \"SQL Endpoint\" in a Fabric Lakehouse?",
    optionA: "It provides a read-only T-SQL interface to query data stored in the Lakehouse (Delta tables).",
    optionB: "It is used to write data to the report.",
    optionC: "It is the primary tool for designing dashboards.",
    optionD: "It replaces the need for Power BI.",
    correctAnswer: "A",
    topic: "Microsoft Fabric"
  },
  {
    questionText: "When referencing an inactive relationship in a measure, which function must be used?",
    optionA: "USERELATIONSHIP",
    optionB: "CROSSFILTER",
    optionC: "RELATED",
    optionD: "CALCULATE",
    correctAnswer: "A",
    topic: "DAX - Intermediate"
  },
  {
    questionText: "What is the specific behavior of TREATAS?",
    optionA: "It applies the result of a table expression as a filter to columns, effectively creating a virtual relationship.",
    optionB: "It performs a SQL JOIN.",
    optionC: "It deletes data.",
    optionD: "It creates a new table in the model.",
    correctAnswer: "A",
    topic: "DAX - Intermediate"
  },
  {
    questionText: "What is the primary difference between a SUM and SUMX?",
    optionA: "SUM aggregates a column directly; SUMX evaluates an expression for every row before aggregating.",
    optionB: "SUMX is faster for simple columns.",
    optionC: "They are the same.",
    optionD: "SUM only works on measures.",
    correctAnswer: "A",
    topic: "Advanced Concepts (Optimization)"
  },
  {
    questionText: "What happens to the filter context when you use ALLSELECTED?",
    optionA: "It removes filters from the context but respects filters applied by slicers and visual interactions.",
    optionB: "It removes all filters from the model.",
    optionC: "It only keeps the filters from the current visual.",
    optionD: "It ignores all user interactions.",
    correctAnswer: "A",
    topic: "DAX - Intermediate"
  },
  {
    questionText: "In performance tuning, what is the significance of the \"Formula Engine\" (FE) vs. \"Storage Engine\" (SE) in DAX execution?",
    optionA: "SE is optimized for fast data retrieval; FE handles complex logic and is typically slower.",
    optionB: "FE is faster than SE.",
    optionC: "They are independent of performance.",
    optionD: "SE only works with DirectQuery.",
    correctAnswer: "A",
    topic: "Log Analytics & Monitoring"
  },
  {
    questionText: "What is the concept of \"OneCopy\" in Fabric?",
    optionA: "Data is stored once in OneLake, and different engines (SQL, Spark, Power BI) access it without duplication.",
    optionB: "All data is copied to every engine.",
    optionC: "You are limited to one copy of a report.",
    optionD: "Only one user can access data at a time.",
    correctAnswer: "A",
    topic: "Microsoft Fabric"
  },
  {
    questionText: "Which of these is a typical cause of a \"Circular Dependency\" error in DAX?",
    optionA: "Creating a calculated column that references another column that itself depends on the first.",
    optionB: "Having too many measures.",
    optionC: "Using DirectQuery mode.",
    optionD: "Having more than 10 tables.",
    correctAnswer: "A",
    topic: "Advanced Concepts (Optimization)"
  },
  {
    questionText: "What is the primary risk of using SUMMARIZE for creating tables in DAX?",
    optionA: "It can be performance-intensive and is recommended to use SUMMARIZECOLUMNS instead for model tables.",
    optionB: "It does not support relationships.",
    optionC: "It only works on dates.",
    optionD: "It is limited to 5 columns.",
    correctAnswer: "A",
    topic: "DAX - Intermediate"
  },
  {
    questionText: "What is the primary difference between the \"Global Admin\" and the \"Power BI Admin\" roles?",
    optionA: "Global Admin has rights across all of M365; PBI Admin is scoped to Power BI/Fabric configurations.",
    optionB: "They have identical permissions.",
    optionC: "PBI Admin can delete the whole tenant.",
    optionD: "Only Global Admin can manage gateways.",
    correctAnswer: "A",
    topic: "Administration"
  },
  {
    questionText: "Why should you avoid FILTER(Table, ...) when FILTER(ALL(Table), ...) or other table expressions can be used?",
    optionA: "FILTER(Table) keeps the current filter context, which can cause unexpected results or reduced performance.",
    optionB: "It is faster to use FILTER(Table).",
    optionC: "It is not allowed in measures.",
    optionD: "It triggers a gateway error.",
    correctAnswer: "A",
    topic: "Advanced Concepts (Optimization)"
  },
  {
    questionText: "What is the purpose of a \"Shortcut\" in OneLake?",
    optionA: "To reference data in an external location (e.g., ADLS Gen2, S3) as if it were in OneLake.",
    optionB: "To create a link to a report.",
    optionC: "To speed up SQL queries.",
    optionD: "To delete files.",
    correctAnswer: "A",
    topic: "Microsoft Fabric"
  },
  {
    questionText: "What is the result of CALCULATE(SUM(Sales), ALL(Product))?",
    optionA: "The sum of sales ignoring all filters on the Product table.",
    optionB: "The sum of sales ignoring all filters on the entire model.",
    optionC: "The sum of sales filtered only by products.",
    optionD: "An error.",
    correctAnswer: "A",
    topic: "DAX - Intermediate"
  },
  {
    questionText: "In a star schema, why is it recommended to use integer surrogate keys rather than text-based natural keys for relationships?",
    optionA: "Integer keys are significantly more memory-efficient and faster for the VertiPaq engine to join.",
    optionB: "Text keys are not supported.",
    optionC: "They are easier to read.",
    optionD: "Integer keys support many-to-many relationships better.",
    correctAnswer: "A",
    topic: "Advanced Concepts (Optimization)"
  },
  {
    questionText: "What is the main difference between \"Service Principal\" and \"Master User\" authentication for embedding?",
    optionA: "Service Principal uses an app identity (no user license required); Master User uses a specific user account.",
    optionB: "Master User is faster.",
    optionC: "Service Principal is only for public web sharing.",
    optionD: "They are the same.",
    correctAnswer: "A",
    topic: "Power BI Embedded"
  },
  {
    questionText: "What does a \"VertiPaq Analyzer\" report tell you?",
    optionA: "Memory consumption breakdown by column and table.",
    optionB: "Who viewed the report.",
    optionC: "How many measures are used.",
    optionD: "Which gateway is used.",
    correctAnswer: "A",
    topic: "Advanced Concepts (Optimization)"
  },
  {
    questionText: "What is the main difference between VALUES and DISTINCT?",
    optionA: "VALUES includes a blank row if a reference fails; DISTINCT does not.",
    optionB: "DISTINCT includes a blank row; VALUES does not.",
    optionC: "They are identical.",
    optionD: "VALUES only works on numbers.",
    correctAnswer: "A",
    topic: "DAX - Intermediate"
  },
  {
    questionText: "What is the purpose of \"Sensitivity Labels\" in Power BI?",
    optionA: "To classify and protect data based on its confidentiality level (e.g., Highly Confidential).",
    optionB: "To change the color of the report.",
    optionC: "To filter data.",
    optionD: "To speed up performance.",
    correctAnswer: "A",
    topic: "Administration"
  },
  {
    questionText: "Which language is primarily used in Fabric Notebooks for data engineering tasks?",
    optionA: "Python/PySpark",
    optionB: "DAX",
    optionC: "M",
    optionD: "Excel Formulas",
    correctAnswer: "A",
    topic: "Microsoft Fabric"
  },
  {
    questionText: "What is the impact of a high number of calculated columns in a model?",
    optionA: "They consume RAM, are calculated at refresh, and often compress poorly.",
    optionB: "They make the report load faster.",
    optionC: "They are the most efficient way to do math.",
    optionD: "They don't affect model size.",
    correctAnswer: "A",
    topic: "DAX - Intermediate"
  },
  {
    questionText: "What is \"Query Folding\"?",
    optionA: "The process of converting M transformation steps into a single native query (e.g., SQL) sent to the source.",
    optionB: "Hiding data columns.",
    optionC: "A way to delete rows.",
    optionD: "A feature of the visual.",
    correctAnswer: "A",
    topic: "Advanced Concepts (Optimization)"
  },
  {
    questionText: "What is the difference between an Audit Log and an Activity Log?",
    optionA: "Audit logs track management and security actions; activity logs track all user interactions, usually queried via APIs.",
    optionB: "They are the same.",
    optionC: "Audit logs are for admins; activity logs are for users.",
    optionD: "Activity logs don't exist in PBI.",
    correctAnswer: "A",
    topic: "Log Analytics & Monitoring"
  },
  {
    questionText: "What is \"Mirroring\" in Fabric for SQL Server?",
    optionA: "An automated service that syncs SQL Server data to OneLake in real-time.",
    optionB: "A manual copy process.",
    optionC: "A way to delete SQL data.",
    optionD: "A reporting tool.",
    correctAnswer: "A",
    topic: "Microsoft Fabric"
  },
  {
    questionText: "Why is SUMX often preferred over CALCULATE(SUM(Column)) inside a measure that iterates over a table?",
    optionA: "SUMX provides row context for complex expressions; CALCULATE forces a context transition.",
    optionB: "SUM is deprecated.",
    optionC: "SUMX is always faster.",
    optionD: "CALCULATE is not allowed in measures.",
    correctAnswer: "A",
    topic: "Advanced Concepts (Optimization)"
  },
  {
    questionText: "What happens if CALCULATE contains multiple modifiers that affect the same column?",
    optionA: "The last filter modifier overrides the previous one (Last-in-Wins).",
    optionB: "They are all applied (AND).",
    optionC: "It returns an error.",
    optionD: "The first one wins.",
    correctAnswer: "A",
    topic: "DAX - Intermediate"
  },
  {
    questionText: "How can an Admin restrict users from exporting data to Excel/CSV?",
    optionA: "Through Tenant Settings in the Admin Portal.",
    optionB: "By deleting the workspace.",
    optionC: "By changing the report password.",
    optionD: "It is not possible.",
    correctAnswer: "A",
    topic: "Administration"
  },
  {
    questionText: "What is the impact of \"Many-to-Many\" cardinality on the model?",
    optionA: "It creates a weaker filter propagation and can cause performance issues if not used carefully.",
    optionB: "It is the most performant relationship.",
    optionC: "It is required for all relationships.",
    optionD: "It reduces model size.",
    correctAnswer: "A",
    topic: "Advanced Concepts (Optimization)"
  },
  {
    questionText: "What is the purpose of ISCROSSFILTERED?",
    optionA: "To check if a column or table is being filtered by other related tables or visuals.",
    optionB: "To check if a visual is empty.",
    optionC: "To count rows.",
    optionD: "To check if a measure is used.",
    correctAnswer: "A",
    topic: "DAX - Intermediate"
  },
  {
    questionText: "What is \"Data Activator\" in Fabric?",
    optionA: "A tool to monitor data conditions and trigger automated actions or alerts.",
    optionB: "A reporting tool.",
    optionC: "A dashboard viewer.",
    optionD: "A data loader.",
    correctAnswer: "A",
    topic: "Microsoft Fabric"
  },
  {
    questionText: "Which engine handles \"Import\" model queries?",
    optionA: "VertiPaq",
    optionB: "DirectQuery",
    optionC: "SQL Server Engine",
    optionD: "Excel Engine",
    correctAnswer: "A",
    topic: "Advanced Concepts (Optimization)"
  },
  {
    questionText: "How can you track the execution time of individual DAX queries?",
    optionA: "Using Performance Analyzer in Desktop or DAX Studio tracing.",
    optionB: "Looking at the dashboard.",
    optionC: "Refreshing the dataset.",
    optionD: "Checking the gateway.",
    correctAnswer: "A",
    topic: "Log Analytics & Monitoring"
  },
  {
    questionText: "What does COALESCE return when the first argument is blank?",
    optionA: "The second argument.",
    optionB: "The first argument.",
    optionC: "An error.",
    optionD: "Zero.",
    correctAnswer: "A",
    topic: "DAX - Intermediate"
  },
  {
    questionText: "What is the benefit of \"Dimension tables\" in a Star Schema?",
    optionA: "They provide descriptive attributes for filtering/slicing and keep fact tables slim.",
    optionB: "They increase query time.",
    optionC: "They are not used in Power BI.",
    optionD: "They store all transaction data.",
    correctAnswer: "A",
    topic: "Advanced Concepts (Optimization)"
  },
  {
    questionText: "What is the role of the \"Capacity Metrics App\"?",
    optionA: "To monitor compute utilization and costs of Fabric/Premium capacities.",
    optionB: "To track report viewers.",
    optionC: "To monitor gateway errors.",
    optionD: "To manage user roles.",
    correctAnswer: "A",
    topic: "Microsoft Fabric"
  },
  {
    questionText: "What is a \"DMV\" query?",
    optionA: "A query used to inspect the internal state and metadata of the Analysis Services engine.",
    optionB: "A query to delete data.",
    optionC: "A query to change visuals.",
    optionD: "A report query.",
    correctAnswer: "A",
    topic: "Advanced Concepts (Optimization)"
  },
  {
    questionText: "What is the result of a measure containing DIVIDE(10, 0)?",
    optionA: "Blank (it handles the division by zero).",
    optionB: "0",
    optionC: "Infinity",
    optionD: "Error",
    correctAnswer: "A",
    topic: "DAX - Intermediate"
  },
  {
    questionText: "What is \"Delta Parquet\"?",
    optionA: "The underlying storage format used in OneLake for Fabric items.",
    optionB: "An Excel format.",
    optionC: "A CSV variant.",
    optionD: "A SQL Server format.",
    correctAnswer: "A",
    topic: "Microsoft Fabric"
  },
  {
    questionText: "When is \"DirectQuery\" preferred over \"Import\"?",
    optionA: "For extremely large datasets or real-time requirements where import is not feasible.",
    optionB: "When performance is the only goal.",
    optionC: "When you want to copy the data.",
    optionD: "When you have no gateway.",
    correctAnswer: "A",
    topic: "Advanced Concepts (Optimization)"
  },
  {
    questionText: "What is the purpose of RANKX?",
    optionA: "To return the rank of an expression within a specific context.",
    optionB: "To sum values.",
    optionC: "To count rows.",
    optionD: "To rename columns.",
    correctAnswer: "A",
    topic: "DAX - Intermediate"
  },
  {
    questionText: "What is the primary purpose of an \"On-Premises Data Gateway\"?",
    optionA: "To allow the Power BI Service to communicate securely with data sources inside a local network.",
    optionB: "To host the Power BI Desktop.",
    optionC: "To store report files.",
    optionD: "To provide user authentication.",
    correctAnswer: "A",
    topic: "Administration"
  },
  {
    questionText: "What does a \"Refresh Failure\" log entry typically indicate?",
    optionA: "A failure to fetch data from the source, often due to credentials, connectivity, or transformation errors.",
    optionB: "A user login issue.",
    optionC: "A report design issue.",
    optionD: "A visual rendering error.",
    correctAnswer: "A",
    topic: "Log Analytics & Monitoring"
  }
];

async function main() {
  console.log("🧹 Clearing old questions...");
  await prisma.response.deleteMany({});
  await prisma.question.deleteMany({});
  
  console.log("🌱 Seeding 50 Power BI & DAX questions...");
  for (const q of questions) {
    await prisma.question.create({ data: q });
  }
  console.log(`✅ Success! Seeded ${questions.length} questions.`);
}

main()
  .catch((e) => {
    console.error("❌ Error seeding questions:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
