 import { User, Mail, Calendar, GraduationCap, Pencil, Trash2 } from 'lucide-react';
 import { Button } from '@/components/ui/button';
 import { Badge } from '@/components/ui/badge';
 import type { Student } from '@/pages/Students';
 
 interface StudentCardProps {
   student: Student;
   academicYears: { id: string; name: string }[];
   onEdit: () => void;
   onDelete: () => void;
 }
 
 export const StudentCard = ({
   student,
   academicYears,
   onEdit,
   onDelete,
 }: StudentCardProps) => {
   const assignedYears = academicYears.filter(year =>
     student.academicYearIds.includes(year.id)
   );
 
   const statusColors = {
     active: 'bg-success/10 text-success border-success/20',
     inactive: 'bg-muted text-muted-foreground border-muted',
     graduated: 'bg-primary/10 text-primary border-primary/20',
   };
 
   const getInitials = (firstName: string, lastName: string) => {
     return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
   };
 
   return (
     <div className="card-elevated p-6 hover:shadow-lg transition-shadow">
       <div className="flex items-start justify-between mb-4">
         <div className="flex items-center gap-3">
           <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
             <span className="font-semibold text-primary">
               {getInitials(student.firstName, student.lastName)}
             </span>
           </div>
           <div>
             <h3 className="font-display font-semibold">
               {student.firstName} {student.lastName}
             </h3>
             <Badge className={statusColors[student.status]} variant="outline">
               {student.status}
             </Badge>
           </div>
         </div>
         <div className="flex gap-1">
           <Button variant="ghost" size="icon" onClick={onEdit}>
             <Pencil className="h-4 w-4" />
           </Button>
           <Button
             variant="ghost"
             size="icon"
             onClick={onDelete}
             className="hover:bg-destructive/10 hover:text-destructive"
           >
             <Trash2 className="h-4 w-4" />
           </Button>
         </div>
       </div>
 
       <div className="space-y-2 text-sm">
         <div className="flex items-center gap-2 text-muted-foreground">
           <Mail className="h-4 w-4" />
           <span>{student.email}</span>
         </div>
         <div className="flex items-center gap-2 text-muted-foreground">
           <Calendar className="h-4 w-4" />
           <span>Born: {new Date(student.dateOfBirth).toLocaleDateString()}</span>
         </div>
         <div className="flex items-center gap-2 text-muted-foreground">
           <User className="h-4 w-4" />
           <span className="capitalize">{student.gender}</span>
         </div>
       </div>
 
       {assignedYears.length > 0 && (
         <div className="mt-4 pt-4 border-t border-border">
           <div className="flex items-center gap-2 mb-2">
             <GraduationCap className="h-4 w-4 text-muted-foreground" />
             <span className="text-sm font-medium">Enrolled In:</span>
           </div>
           <div className="flex flex-wrap gap-1">
             {assignedYears.map((year) => (
               <Badge key={year.id} variant="secondary" className="text-xs">
                 {year.name}
               </Badge>
             ))}
           </div>
         </div>
       )}
     </div>
   );
 };